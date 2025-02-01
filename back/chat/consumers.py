from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Message, Conversation
from django.db.models import Q
import json
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

User = get_user_model()

class NotifConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            return

        await self.accept()
        await self.update_status(True)
        await self.add_user_to_online_list()
        await self.notify_friends_status(True)
        await self.send_friends_online_status()
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        if data.get('type') == 'send_challenge':
            username = data.get('sender')
            if not username:
                return
            challenge_receiver = await self.get_user_by_username(username)
            if not challenge_receiver:
                await self.send_json({"type": "error", "message": "User not found"})
                return
            
            if not challenge_receiver.is_online:
                await self.send_json({"type": "error", "message": "User is offline"})
                return
            profile_image = await self.get_user_profile_image(self.user)
            await self.channel_layer.group_send(
                
                f"user_{challenge_receiver.id}_notifications",
                {
                    "type": "challenge_notification",
                    "sender": self.user.username,
                    "content": "You have a new challenge!",
                    "profile_image": profile_image,
                }
            )
        elif data.get('type') == 'accepte_challenge':
            await self.handle_accept_challenge(data)

            
    async def handle_accept_challenge(self, data):
        username = data.get('sender')
        if not username:
            await self.send_json({
                "type": "error",
                "message": "Username is required"
            })
            return
            
        challenger = await self.get_user_by_username(username)
        if not challenger:
            await self.send_json({
                "type": "error",
                "message": "User not found"
            })
            return
            
        if not challenger.is_online:
            await self.send_json({
                "type": "error",
                "message": "User is offline"
            })
            return

        profile_image = await self.get_user_profile_image(self.user)
        
        await self.channel_layer.group_send(
            f"user_{challenger.id}_notifications",
            {
                "type": "challenge_accepted",
                "sender": self.user.username,
                "reciver": challenger.username,
                "content": f"{self.user.username} has accepted your challenge!",
                "profile_image": profile_image,
            }
        )


    async def challenge_accepted(self, event):
        await self.send_json({
            "type": "challenge_accepted",
            "sender": event["sender"],
            "reciver": event["reciver"],
            "content": event["content"],
            "profile_image": event["profile_image"],
        })


    async def challenge_notification(self, event):
        await self.send_json({
            "type": "challenge_notification",
            "sender": event["sender"],
            "content": event["content"],
            "profile_image": event["profile_image"],
        })

    @sync_to_async
    def get_user_by_username(self, username):
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            return None


    async def disconnect(self, close_code):
        await self.update_status(False)
        await self.notify_friends_status(False)
        await self.remove_user_from_online_list()
    
        
    async def send_friends_online_status(self):
        friends = await self.get_friends()
        for friend in friends:
            is_online = await self.get_user_online_status(friend)
            profile_image = await self.get_user_profile_image(friend)
            await self.send_json({
                "type": "friend_status",
                "username": friend.username,
                "online": is_online,
                "profile_image": profile_image,
            })


    async def add_user_to_online_list(self):
        await self.channel_layer.group_add(
            f"user_{self.user.id}_notifications", 
            self.channel_name
        )
    
    async def remove_user_from_online_list(self):
        await self.channel_layer.group_discard(
            f"user_{self.user.id}_notifications", 
            self.channel_name
        )


    async def notify_friends_status(self, online):
        friends = await self.get_friends()
        profile_image = await self.get_user_profile_image(self.user)
        for friend in friends:
            await self.channel_layer.group_send(
                f"user_{friend.id}_notifications",
                {
                    "type": "friend_status",
                    "username": self.user.username,
                    "online": online,
                    "profile_image": profile_image,
                }
            )
    @sync_to_async
    def get_user_profile_image(self, user):
        return user.profile_image.url if user.profile_image else None

    async def friend_status(self, event):
        await self.send_json({
            "type": "friend_status",
            "username": event["username"],
            "online": event["online"],
            "profile_image": event["profile_image"],
        })

    @sync_to_async
    def update_status(self, online):
        # pass
        # self.user = self.user_obj
        # self.user_obj.is_online = online
        try:
            self.user = User.objects.get(username=self.user.username)
        
            self.user.is_online = online
            self.user.save()
        except User.DoesNotExist:
            return
    
    @sync_to_async
    def get_user_online_status(self, user):
        return user.is_online

    
    @sync_to_async
    def get_friends(self):
        return list(self.user.list_users_friends.all())


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