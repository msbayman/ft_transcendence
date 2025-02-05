from django.contrib.auth import get_user_model
import json
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer


User = get_user_model()

class NotifConsumer(AsyncJsonWebsocketConsumer):
    online_players = []
    async def connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            await self.close()
            return
        await self.accept()
        self.online_players.append(self.user.username)
        await self.update_status(True)
        await self.add_user_to_online_list()
        await self.notify_friends_status(True)
        await self.send_friends_online_status() 
# ------------------------------------------------------------------------------ #
    async def receive(self, text_data):
        try:
            valid_types = {'send_challenge', 'accept_challenge', 'clear_list'}
            data = json.loads(text_data)
            message_type = data.get('type')
            if message_type not in valid_types:
                await self.send_json({"type": "error", "message": "Invalid message type"})
                return
            if not await self.check_data(data):
                return
            elif message_type == 'send_challenge':
                await self.handle_recive_challenge(data)
            elif message_type == 'clear_list':
                await self.handle_clear_list(data)
            elif message_type == 'accept_challenge':
                await self.handle_accept_challenge(data)
        except json.JSONDecodeError:
            await self.send_json({"type": "error", "message": "Invalid JSON format"})
            return
# ------------------------------------------------------------------------------ #
    async def disconnect(self, close_code):
        if hasattr(self, 'user') and self.user.is_authenticated:
            if self.user.username in self.online_players:
                self.online_players.remove(self.user.username)
            if self.user.username not in self.online_players:
                await self.update_status(False)
                await self.notify_friends_status(False)
                await self.remove_user_from_online_list()
# actions
# ------------------------------------------------------------------------------ #
    async def check_data(self, data):
        username = data.get('sender')
        if not username:
            await self.send_json({"type": "error", "message": "Username is required"})
            return False
        self.challenge_receiver = await self.get_user_by_username(username)
        if not self.challenge_receiver:
            await self.send_json({"type": "error", "message": "User not found"})
            return False
        if username == self.user.username:
            await self.send_json({"type": "error", "message": "you can't send this action to your self"})
            return False
        if not  self.challenge_receiver.is_online:
            await self.send_json({"type": "error", "message": "User is offline"})
            return False
        return True
# ------------------------------------------------------------------------------ #
    async def handle_recive_challenge(self, data):
        profile_image = await self.get_user_profile_image(self.user)
        await self.channel_layer.group_send(
            
            f"user_{self.challenge_receiver.id}_notifications",
            {
                "type": "challenge_notification",  
                "sender": self.user.username,
                "content": "You have a new challenge!",
                "profile_image": profile_image,
            }   
        )
# ------------------------------------------------------------------------------ #
    async def handle_clear_list(self, data):
        try:
            while self.user.username in self.online_players:
                self.online_players.remove(self.user.username)
        except ValueError:
            pass  # Handle case where username isn't in list 
        
        # Optionally notify other users about the status change
        await self.update_status(False)
        await self.notify_friends_status(False)
# ------------------------------------------------------------------------------ #
    async def handle_accept_challenge(self, data):
        challenger_username = data.get('sender')  # Add this
        challenger = await self.get_user_by_username(challenger_username)
        profile_image = await self.get_user_profile_image(self.user)
        await self.channel_layer.group_send(
            f"user_{challenger.id}_notifications",
            {
                "type": "challenge_accepted",
                "sender": self.user.username,
                "receiver": challenger.username,
                "content": f"{self.user.username} has accepted your challenge!",
                "profile_image": profile_image,
            }
        )  
# ------------------------------------------------------------------------------ #     
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
# ------------------------------------------------------------------------------ #
    async def add_user_to_online_list(self):
        await self.channel_layer.group_add(
            f"user_{self.user.id}_notifications",
            self.channel_name
        )
# ------------------------------------------------------------------------------ #
    async def remove_user_from_online_list(self):
        await self.channel_layer.group_discard(
            f"user_{self.user.id}_notifications",
            self.channel_name
        )
# ------------------------------------------------------------------------------ #
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
#event
# ------------------------------------------------------------------------------ #
    async def challenge_notification(self, event):
        await self.send_json({
            "type": "challenge_notification",
            "sender": event["sender"],
            "content": event["content"],
            "profile_image": event["profile_image"],
        })
# ------------------------------------------------------------------------------ #
    async def challenge_accepted(self, event):
        await self.send_json({
            "type": "challenge_accepted",
            "sender": event["sender"],
            "receiver": event["receiver"],
            "content": event["content"],
            "profile_image": event["profile_image"],
        })
# ------------------------------------------------------------------------------ #
    async def friend_status(self, event):
        await self.send_json({
            "type": "friend_status",
            "username": event["username"],
            "online": event["online"],
            "profile_image": event["profile_image"],
        })
        
# getters/setter 
# ------------------------------------------------------------------------------ #
    @sync_to_async
    def update_status(self, online):
        try:
            self.user = User.objects.get(username=self.user.username)
        
            self.user.is_online = online
            self.user.save()
        except User.DoesNotExist:
            return
    
    @sync_to_async
    def get_user_online_status(self, user):
        return user.is_online
# ------------------------------------------------------------------------------ #

    @sync_to_async
    def get_friends(self):
        return list(self.user.list_users_friends.all())
    
# ------------------------------------------------------------------------------ #  
    @sync_to_async
    def get_user_profile_image(self, user):
        return user.profile_image.url if user.profile_image else None
# ------------------------------------------------------------------------------ #
    @sync_to_async
    def get_user_by_username(self, username):
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            return None