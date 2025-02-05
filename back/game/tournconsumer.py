import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.db import transaction
from channels.db import database_sync_to_async
from .models import Match, Tourn
from asyncio import Lock

class TournConsumer(AsyncWebsocketConsumer):
    players = []
    connected_users = {}
    check_is_tourngame = 0;
    

    async def connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated or self.user in self.players:
            await self.close()
            return
        self.players.append(self.user)
        self.connected_users[self.user] = self

        await self.accept()
        await self.check_start_tourn()

    async def check_start_tourn(self):
        if len(self.players) >= 4:

            await self.create_tourn()

    async def create_tourn(self):
        ply1 = self.players.pop(0)
        ply2 = self.players.pop(0)
        ply3 = self.players.pop(0)
        ply4 = self.players.pop(0)
        
        tourn_tb = await self.create_tourn_in_db(ply1, ply2, ply3, ply4)
        await self.start_game(ply1, ply2, ply3, ply4, tourn_tb)



    @database_sync_to_async
    def create_tourn_in_db(self, ply1, ply2, ply3, ply4):
        with transaction.atomic():
            return Tourn.objects.create(player1=ply1, player2=ply2, player3=ply3, player4=ply4)
    
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

    async def start_game(self, player1, player2, player3, player4, tourn):
        p1 = await self.get_player_data(player1)
        p2 = await self.get_player_data(player2)
        p3 = await self.get_player_data(player3)
        p4 = await self.get_player_data(player4)
        tourn_id = tourn.id
        tourn_data = {
            "type": "tourn_start",
            "tourn_id": tourn_id,
            "player1": p1,
            "player2": p2,
            "player3": p3,
            "player4": p4,
        }
        await self.send_to_player(player1, tourn_data)
        await self.send_to_player(player2, tourn_data)
        await self.send_to_player(player3, tourn_data)
        await self.send_to_player(player4, tourn_data)

    # async def creat_semi1_semi2(self, player1, player2, player3, player4):

    #creat match (semis and final)
    @database_sync_to_async
    def create_match_in_db(self, player1, player2):
        with transaction.atomic():
            return Match.objects.create(player1=player1, player2=player2)

    # async def start_game(self, player1, player2, match):
    #     p1 = await self.get_player_data(player1)
    #     p2 = await self.get_player_data(player2)
    #     match_id = match.id
    #     match_data = {
    #         "type": "game_start",
    #         "match_id": match_id,
    #         "player1": p1,
    #         "player2": p2,
    #     }
    #     await self.send_to_player(player1, match_data)
    #     await self.send_to_player(player2, match_data)

    # @database_sync_to_async
    # def get_player_data(self, player):
    #     return {
    #         "username": player.full_name,
    #         "email": player.email,
    #         "profile_image": player.profile_image.url if player.profile_image else None,
    #         "points": player.points,
    #         "level": player.level,
    #         "total_games": player.total_games,
    #         "win_games": player.win_games,
    #         "lose_games": player.lose_games,
    #     }


    async def send_to_player(self, player, data):
        player_connection = self.connected_users.get(player)
        if player_connection:
            await player_connection.send(text_data=json.dumps(data))

    async def disconnect(self, close_code):
        if self.user in self.players:
            self.players.remove(self.user)
        if self.user in self.connected_users:
            del self.connected_users[self.user]