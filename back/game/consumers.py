import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.db import transaction
from channels.db import database_sync_to_async
from .models import Match



class ChalleConsumer(AsyncWebsocketConsumer):
    players = []
    connected_users = {}

    async def connect(self):
        self.user = self.scope["user"]
        self.ply = self.scope["url_route"]["kwargs"]["id"].split("+")
        
        if not self.user.is_authenticated:
            await self.close()
            return
        await self.accept()
        
        if not self.user.username in self.ply:
            await self.close()
            return 
        
        if self.user in self.players:
            await self.close()
            return
        if self.user in self.connected_users:
            await self.close()
            return

        self.players.append(self.user)
        self.connected_users[self.user] = self

        await self.creat_match()

    async def disconnect(self, close_code):
        if self.user in self.players:
            self.players.remove(self.user)
        if self.user in self.connected_users:
            del self.connected_users[self.user]

    async def creat_match(self):
        if len(self.players) >= 2:
            ply1 = self.players.pop(0)
            ply2 = self.players.pop(0)
            match_tb = await self.create_match_in_db(ply1, ply2)
            await self.start_game(ply1, ply2, match_tb)

    @database_sync_to_async
    def create_match_in_db(self, player1, player2):
        with transaction.atomic():
            return Match.objects.create(player1=player1, player2=player2)

    async def start_game(self, player1, player2, match):
        p1 = await self.get_player_data(player1)
        p2 = await self.get_player_data(player2)
        match_id = match.id
        match_data = {
            "type": "game_start",
            "match_id": match_id,
            "player1": p1,
            "player2": p2,
        }
        await self.send_to_player(player1, match_data)
        await self.send_to_player(player2, match_data)

    @database_sync_to_async
    def get_player_data(self, player):
        return {
            "username": player.username,
            "email": player.email,
            "profile_image": player.profile_image.url if player.profile_image else None,
            "points": player.points,
            "level": player.level,
            "total_games": player.total_games,
            "win_games": player.win_games,
            "lose_games": player.lose_games,
        }
    
    async def send_to_player(self, player, data):
        player_connection = self.connected_users.get(player)
        self.connected_users.pop(player, None)
        if player_connection:
            await player_connection.send(text_data=json.dumps(data))


#  ============================================================ #

class MatchMakingConsumer(AsyncWebsocketConsumer):
    
    players = []
    connected_users = {}

    async def connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            await self.close()
            return
        if self.user in self.players:
            
            await self.close()
            return
        if self.user in self.connected_users:
            await self.close()
            return

        self.players.append(self.user)
        self.connected_users[self.user] = self

        await self.accept()
        await self.creat_match()

    async def disconnect(self, close_code):
        if self.user in self.players:
            self.players.remove(self.user)
        if self.user in self.connected_users:
            del self.connected_users[self.user]
        
    async def creat_match(self):
        if len(self.players) >= 2:
            ply1 = self.players.pop(0)
            ply2 = self.players.pop(0)
            match_tb = await self.create_match_in_db(ply1, ply2)
            await self.start_game(ply1, ply2, match_tb)

    @database_sync_to_async
    def create_match_in_db(self, player1, player2):
        with transaction.atomic():
            return Match.objects.create(player1=player1, player2=player2)

    async def start_game(self, player1, player2, match):
        p1 = await self.get_player_data(player1)
        p2 = await self.get_player_data(player2)
        match_id = match.id
        match_data = {
            "type": "game_start",
            "match_id": match_id,
            "player1": p1,
            "player2": p2,
        }
        await self.send_to_player(player1, match_data)
        await self.send_to_player(player2, match_data)

    @database_sync_to_async
    def get_player_data(self, player):
        return {
            "username": player.username,
            "email": player.email,
            "profile_image": player.profile_image.url if player.profile_image else None,
            "points": player.points,
            "level": player.level,
            "total_games": player.total_games,
            "win_games": player.win_games,
            "lose_games": player.lose_games,
        }
    
    async def send_to_player(self, player, data):
        player_connection = self.connected_users.get(player)
        self.connected_users.pop(player, None)
        if player_connection:
            await player_connection.send(text_data=json.dumps(data))


# handel connected_users same player tow times
class SgMatchMakingConsumer(AsyncWebsocketConsumer):
    
    players = []
    connected_users = {}

    async def connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            await self.close()
            return
        if self.user in self.players:
            
            await self.close()
            return
        if self.user in self.connected_users:
            await self.close()
            return

        self.players.append(self.user)
        self.connected_users[self.user] = self

        await self.accept()
        await self.creat_match()

    async def disconnect(self, close_code):
        if self.user in self.players:
            self.players.remove(self.user)
        if self.user in self.connected_users:
            del self.connected_users[self.user]
        
    async def creat_match(self):
        if len(self.players) >= 2:
            ply1 = self.players.pop(0)
            ply2 = self.players.pop(0)
            match_tb = await self.create_match_in_db(ply1, ply2)
            await self.start_game(ply1, ply2, match_tb)


    @database_sync_to_async
    def create_match_in_db(self, player1, player2):
        with transaction.atomic():
            return Match.objects.create(game_type=True, player1=player1, player2=player2)

    async def start_game(self, player1, player2, match):
        p1 = await self.get_player_data(player1)
        p2 = await self.get_player_data(player2)
        match_id = match.id
        match_data = {
            "type": "game_start",
            "match_id": match_id,
            "player1": p1,
            "player2": p2,
        }
        await self.send_to_player(player1, match_data)
        await self.send_to_player(player2, match_data)

    @database_sync_to_async
    def get_player_data(self, player):
        return {
            "username": player.username,
            "email": player.email,
            "profile_image": player.profile_image.url if player.profile_image else None,
            "points": player.points,
            "level": player.level,
            "total_games": player.total_games,
            "win_games": player.win_games,
            "lose_games": player.lose_games,
        }
    
    async def send_to_player(self, player, data):
        player_connection = self.connected_users.get(player)
        self.connected_users.pop(player, None)
        if player_connection:
            await player_connection.send(text_data=json.dumps(data))