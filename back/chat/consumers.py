from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Message, Conversation
from django.db.models import Q
import json

User = get_user_model()

class NotifConsumer(AsyncWebsocketConsumer):
    # Shared variable to track connection status per user
    # connected_users = {}

    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        print("test test")
    #     self.user = self.scope['user']

    #     # Check if the user is authenticated
    #     if not self.user.is_authenticated:
    #         return

    #     # Check if the user is already connected
    #     if self.connected_users.get(self.user.id, False):
    #         return

    #     # Mark user as connected
    #     self.connected_users[self.user.id] = True

    #     # Add the user to the group
    #     self.user_room = f'notif_{self.user.id}'
    #     await self.channel_layer.group_add(self.user_room, self.channel_name)

    #     self.user_object = await self.get_user_obj1(self.user.username)
    #     await self.set_user_status(True)

        # if hasattr(self, 'user_room'):
            # Remove the user from the group
            # await self.channel_layer.group_discard(self.user_room, self.channel_name)
            # await self.set_user_status(False)

    #     # Mark user as disconnected
    #     if self.user.id in self.connected_users:
    #         self.connected_users[self.user.id] = False


    # @database_sync_to_async
    # def get_user_obj1(self, username):  # Removed async keyword
    #     return User.objects.get(username=username)

    # @database_sync_to_async
    # def set_user_status(self, status):  # Removed async keyword
    #     self.user_object.is_online = status
    #     self.user_object.save()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        if not self.user.is_authenticated:
            return
        
        # Initialize user object
        self.user_obj = await self.get_user_obj(self.user.username)
        self.user1_id = self.user.id
        self.user1_room = f'chat_{self.user1_id}'
        await self.channel_layer.group_add(self.user1_room, self.channel_name)
        await self.accept()

    async def is_blocked(self, sender, receiver):
        try:
            sender_player = await database_sync_to_async(User.objects.get)(username=sender)
            receiver_player = await database_sync_to_async(User.objects.get)(username=receiver)
            
            # Check both directions of blocking
            sender_blocked = await database_sync_to_async(lambda: receiver_player in sender_player.blocked_users.all())()
            receiver_blocked = await database_sync_to_async(lambda: sender_player in receiver_player.blocked_users.all())()
            
            return sender_blocked or receiver_blocked
        except User.DoesNotExist:
            return False
    
    @database_sync_to_async
    def get_user_obj(self, username):
        return User.objects.get(username=username)
    
    @database_sync_to_async
    def get_user_id_by_username(self, username):
        try:
            return User.objects.get(username=username).id
        except User.DoesNotExist:
            return None
    
    @database_sync_to_async
    def check_friendship(self, username_to_check):
        try:
            return self.user_obj.list_users_friends.filter(username=username_to_check).exists()
        except Exception:
            return False
        
    @database_sync_to_async
    def get_or_create_conversation(self, user2_id):
        # Check friendship before creating conversation
        if not self.user_obj.list_users_friends.filter(id=user2_id).exists():
            raise ValueError("Users must be friends to create a conversation")
            
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

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender': event['sender'],
            'receiver': event['receiver'],
            'timestamp': event['timestamp'],
            'id': event['id']
        }))

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message = data['message']
            user2_username = data['username']
            
            # Check if message is empty or too long
            if not message.strip():
                return
            
            if len(message) > 100:  # Add character limit check
                await self.send(text_data=json.dumps({
                    'error': 'Message cannot exceed 100 characters'
                }))
                return
                
            # Check if users are friends
            is_friend = await self.check_friendship(user2_username)
            if not is_friend:
                await self.send(text_data=json.dumps({
                    'error': 'You can only send messages to friends'
                }))
                return

            # Check for blocked status in both directions
            if await self.is_blocked(self.user.username, user2_username):
                await self.send(text_data=json.dumps({
                    'type': 'block_error',
                    'message': 'Cannot send message - this user is either blocked or has blocked you'
                }))
                return
                
            # Get receiver ID
            self.receiver_id = await self.get_user_id_by_username(user2_username)
            if not self.receiver_id:
                await self.send(text_data=json.dumps({
                    'error': f'User {user2_username} not found'
                }))
                return
            
            # Get or create conversation
            try:
                self.conversation = await self.get_or_create_conversation(self.receiver_id)
            except ValueError as e:
                await self.send(text_data=json.dumps({
                    'error': str(e)
                }))
                return
                
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