from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import Message
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if not self.user.is_authenticated:
            await self.close()
            return
        self.username = self.scope['url_route']['kwargs']['username']
        self.receiver = await self.get_user_by_username(self.username)

        # The unique room name for the conversation, this could be a combination of sender and receiver IDs
        self.room_group_name = f'chat_{self.user.id}_{self.receiver.id}'
        
        # Join the room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        
        # Get previous messages (conversation history) and send it to the WebSocket
        messages = await self.get_conversation(self.user.id, self.receiver.id)
        for message in messages:
            await self.send(text_data=json.dumps({
                'sender': message.sender.username,
                'message': message.content
            }))
        
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        # Receive message from WebSocket
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Save the message in the database
        await self.save_message(message)
        
        # Send message to room group (broadcast to all connected users)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'sender': self.user.username,
                'message': message
            }
        )

    async def chat_message(self, event):
        # Send the message to WebSocket
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender': event['sender']
        }))

    # Helper method to get the user by username
    @database_sync_to_async
    def get_user_by_username(self, username):
        return User.objects.get(username=username)

    # Helper method to get the conversation
    @database_sync_to_async
    def get_conversation(self, sender_id, receiver_id):
        return Message.objects.filter(
            (Q(sender_id=sender_id) & Q(receiver_id=receiver_id)) | 
            (Q(sender_id=receiver_id) & Q(receiver_id=sender_id))
        ).order_by('created_at')

    # Helper method to save a new message
    @database_sync_to_async
    def save_message(self, message):
        receiver = User.objects.get(username=self.username)
        Message.objects.create(
            sender=self.user,
            receiver=receiver,
            content=message
        )
