from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Message, Conversation
from django.db.models import Q
import json

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if not self.user.is_authenticated:
            return
            
        self.user1_id = self.user.id
        self.user1_room = f'chat_{self.user1_id}'
        await self.channel_layer.group_add(self.user1_room, self.channel_name)
        await self.accept()

    @database_sync_to_async
    def get_user_id_by_username(self, username):
        try:
            return User.objects.get(username=username).id
        except User.DoesNotExist:
            return None

    @database_sync_to_async
    def get_or_create_conversation(self, user2_id):
        conversation = Conversation.objects.filter(
            (Q(user1_id=self.user1_id) & Q(user2_id=user2_id)) |
            (Q(user1_id=user2_id) & Q(user2_id=self.user1_id))
        ).first()
        
        if not conversation:
            conversation = Conversation.objects.create(
                user1_id=self.user1_id,
                user2_id=user2_id
            )
        return conversation

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message = data['message']
            user2_username = data['username']
            
            if not message.strip():
                return
                
            self.receiver_id = await self.get_user_id_by_username(user2_username)
            if not self.receiver_id:
                await self.send(text_data=json.dumps({
                    'error': f'User {user2_username} not found'
                }))
                return
            
            self.conversation = await self.get_or_create_conversation(self.receiver_id)
            user2_room = f'chat_{self.receiver_id}'
            
            saved_message = await self.save_message(message)
            
            # Send message to both user groups
            message_data = {
                'type': 'chat_message',
                'message': saved_message['content'],
                'sender': saved_message['sender'],
                'receiver': saved_message['receiver'],
                'timestamp': saved_message['timestamp'],
                'id': saved_message['id']
            }
            
            await self.channel_layer.group_send(self.user1_room, message_data)
            await self.channel_layer.group_send(user2_room, message_data)
            
        except Exception as e:
            await self.send(text_data=json.dumps({'error': str(e)}))

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender': event['sender'],
            'receiver': event['receiver'],
            'timestamp': event['timestamp'],
            'id': event['id']
        }))

    @database_sync_to_async
    def save_message(self, message):
        receiver = User.objects.get(id=self.receiver_id)
        msg = Message.objects.create(
            conversation=self.conversation,
            sender=self.user,
            receiver=receiver,
            content=message
        )
        return {
            'id': msg.id,
            'sender': msg.sender.username,
            'receiver': receiver.username,
            'content': msg.content,
            'timestamp': msg.timestamp.timestamp()
        }

    async def disconnect(self, close_code):
        if hasattr(self, 'user1_room'):
            await self.channel_layer.group_discard(
                self.user1_room,
                self.channel_name
            )