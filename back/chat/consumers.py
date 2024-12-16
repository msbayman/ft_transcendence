import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Message


User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.username = self.scope['url_route']['kwargs']['username'] #receiver
        self.user = self.scope['user'] #sender
        
        self.sender_id = self.user.id
        self.receiver_id = await self.get_user_id_by_username(self.username)
        
        print(f"sender_id: {self.sender_id}")
        print(f"receiver_id: {self.receiver_id}")
        unique_id = self.sender_id + self.receiver_id
        self.room_group_name = f'chat_{unique_id}'
        # print(f"\ngroup_name: {self.room_group_name}")
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
    
    @database_sync_to_async
    def get_user_id_by_username(self, username):
        """Fetches the user ID for a given username."""
        try:
            user = User.objects.get(username=username)
            return user.id
        except User.DoesNotExist:
            return None
    
    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        
        await self.save_message(message)
        
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': self.user.username
            }
        )
    
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender': event['sender']
        }))
    
    @database_sync_to_async
    def save_message(self, message):
        receiver = User.objects.get(username=self.username)
        Message.objects.create(
            sender=self.user,
            receiver=receiver,
            content=message
        )
        # print(f"sender:{self.user}\n, receiver:{receiver}")