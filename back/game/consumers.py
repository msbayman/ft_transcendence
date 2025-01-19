import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.db import transaction
from channels.db import database_sync_to_async
from .models import Match

class MatchMakingConsumer(AsyncWebsocketConsumer):
    
    players = []

    async def connect(self):
        await self.accept()
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            await self.close()
            return
        if self.user in self.players:
            return
        self.players.append(self.user)
        await self.creat_match()

    async def disconnect(self, close_code):
        if self.user in self.players:
            self.players.remove(self.user)
        #     match_data = {
        #         "type": "disconnect",
        #     }
        # await self.send(text_data=json.dumps(match_data))

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
        await self.send(text_data=json.dumps(match_data))

    @database_sync_to_async
    def get_player_data(self, player):
        return {
            "username": player.full_name,
            "email": player.email,
            "profile_image": player.profile_image.url if player.profile_image else None,
            "points": player.points,
            "level": player.level,
            "total_games": player.total_games,
            "win_games": player.win_games,
            "lose_games": player.lose_games,
        }


