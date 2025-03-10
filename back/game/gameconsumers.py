from django.db import transaction
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import asyncio
from .models import Match
from user_auth.models import Player
import math
from asgiref.sync import sync_to_async

class GameConsumer(AsyncWebsocketConsumer):
    rooms = {}
    act_ply = {}

    async def connect(self):
        self.user = self.scope['user']
        self.room_name = self.scope["url_route"]["kwargs"]["id"]

        self.room_group_name = f'game_{self.room_name}'

        if not self.is_part_of_the_game(self.user, self.room_name):
            await self.close()
            return

        if not self.user.is_authenticated:
            await self.close()
            return
        
        await self.accept()
        if self.user.username in self.act_ply:
            await self.close()
            return

        if self.room_name not in self.rooms:
            self.rooms[self.room_name] = {
                'game_state': {
                    'ball': {'x': 250, 'y': 365, 'dx': 5, 'dy': 5},
                    'paddles': {'up': 180, 'down': 180},
                    'score': {'p1': 0, 'p2': 0},
                    'side': {'up': None, 'down': None},
                    'winner' : None,
                },
                'players': {
                    'up': None,
                    'down': None,
                },
            }

        self.act_ply[self.user.username] = self.room_name

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )

        room = self.rooms[self.room_name]
        game_state = room["game_state"]
        try:
            self.match = await self.get_the_game_by_id(self.room_name)
            if not self.match:
                await self.close()
                return
            if self.match.player1 == self.user.username:
                if room['players']['up'] is None:
                    room['players']['up'] = self.user
                    game_state["side"]["up"] = room['players']['up'].username
            elif self.match.player2 == self.user.username:
                if room['players']['down'] is None:
                    room['players']['down'] = self.user
                    game_state["side"]["down"] = room['players']['down'].username

            # -------------------------
            if self.match.status == 2:
                await self.close()
                return
            
        except Exception as e:
            await self.close()
            return

        if room['players']['up'] and room['players']['down']:
            self.game_task = asyncio.create_task(self.game_loop())

    async def is_part_of_the_game(self, name, id):
        try:
            game:Match = Match.objects.get(id=id)
            if game.player1 != name and game.player2 != name:
                return 1
        except Match.DoesNotExist:
            print(f"Match with ID {self.room_name} not found")
        except Exception as e:
            print(f"Error saving match score: {e}")
        return 0
             
    @database_sync_to_async
    def get_the_game_by_id(self, match_id):
        try:
            return Match.objects.get(id=match_id)
        except Match.DoesNotExist:
            return None
        
    async def update_match_score(self, score1, score2):
        if self.match:
            await self.save_match_score(score1, score2)

    @database_sync_to_async
    def save_match_score(self, score1, score2):
        try:
            match:Match = Match.objects.get(id=self.room_name)
            match.player1_score = score1
            match.player2_score = score2
            if match.player1_score == 3 or match.player2_score == 3:
                match.status = 2
            match.save()
        except Match.DoesNotExist:
            print(f"Match with ID {self.room_name}  not found")
        except Exception as e:
            print(f"Error saving match score: {e}")


    @database_sync_to_async
    def save_user(self):
        self.user.save()

    async def update_user_after_game(self, winnner, score):
        if self.user.username == winnner:
    
            self.user.total_games += 1
            self.user.win_games += 1
            self.user.points += 300
            self.user.level = math.floor( self.user.points / 1000 ) + 1
    
            if self.user.win_games == 1:
                self.user.win_1_game = True
            if self.user.win_games == 3:
                self.user.win_3_games = True
            if self.user.win_games == 10:
                self.user.win_10_games = True
            if self.user.win_games == 30:
                self.user.win_30_games = True
            if self.user.level > 5:
                self.user.reach_level_5 = True
            if self.user.level > 15:
                self.user.reach_level_15 = True
            if self.user.level > 30:
                self.user.reach_level_30 = True
            if score == 0:
                self.user.perfect_win_game = True
        else:
            self.user.total_games += 1
            self.user.lose_games += 1
            self.user.level = math.floor( self.user.points / 1000 ) + 1
                
        await self.save_user()
    
#--------------------------------------------------------------------------------------
    async def disconnect(self, close_code):

        if self.user.username in self.act_ply:
            del self.act_ply[self.user.username]

        if not self.rooms.get(self.room_name):
            return

        room = self.rooms[self.room_name]
        game_state = room["game_state"]

        if not game_state["winner"]:
            if room['players']['up'] == self.user:
                game_state["winner"] = room['players']['down'].username if room['players']['down'] else None
                game_state["score"]["p2"] = 3
                game_state["score"]["p1"] = 0
            elif room['players']['down'] == self.user:
                game_state["winner"] = room['players']['up'].username if room['players']['up'] else None
                game_state["score"]["p1"] = 3
                game_state["score"]["p2"] = 0
            await self.update_match_score(game_state["score"]["p1"], game_state["score"]["p2"])

        await self.update_user_after_game(game_state["winner"], game_state["score"]["p2"])
        await self.broadcast_end_game(game_state)
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

        if not any(room['players'].values()):
            del self.rooms[self.room_name]

#--------------------------------------------------------------------------------------
    async def receive(self, text_data):
        room = self.rooms[self.room_name]
        data = json.loads(text_data)

        if "paddle" in data:
            paddle = data["paddle"]

        if self.user == room['players']['up']:
            if paddle == "upP":
                room["game_state"]["paddles"]["up"] = max(
                    5, min(365, room["game_state"]["paddles"]["up"] - 20)
                )
            elif paddle == "upD":
                room["game_state"]["paddles"]["up"] = max(
                    5, min(365, room["game_state"]["paddles"]["up"] + 20)
                )
        elif self.user == room['players']['down']:
            if paddle == "upP":
                room["game_state"]["paddles"]["down"] = max(
                    5, min(365, room["game_state"]["paddles"]["down"] - 20)
                )
            elif paddle == "upD":
                room["game_state"]["paddles"]["down"] = max(
                    5, min(365, room["game_state"]["paddles"]["down"] + 20)
                )
            elif paddle == "reset":
                room["game_state"]["paddles"]["down"] = 150
                room["game_state"]["paddles"]["up"] = 150
                await self.reset_ball() 
        await self.broadcast_game_state()

    async def ball_moves(self):
        room = self.rooms[self.room_name]
        game_state = room["game_state"]
        game_state["ball"]["x"] += game_state["ball"]["dx"]
        game_state["ball"]["y"] += game_state["ball"]["dy"]

        ball_x = game_state["ball"]["x"]
        ball_y = game_state["ball"]["y"]
        dx = game_state["ball"]["dx"]
        dy = game_state["ball"]["dy"]

        # walls collision
        if ball_x <= 0 or ball_x >= 490:
            game_state["ball"]["dx"] = -dx

        paddle_width = 150

        # Ball collision (top paddle)
        if (
            ball_y <= 27 and
            ball_x >= game_state["paddles"]["up"] and
            ball_x <= game_state["paddles"]["up"] + paddle_width
        ):
            impact_point = (ball_x - game_state["paddles"]["up"]) / paddle_width - 0.5
            game_state["ball"]["dx"] += impact_point * 4
            game_state["ball"]["dy"] = abs(dy)

        # Ball collision (bott paddle)
        if (
            ball_y >= 700 and
            ball_x >= game_state["paddles"]["down"] and
            ball_x <= game_state["paddles"]["down"] + paddle_width
        ):
            impact_point = (ball_x - game_state["paddles"]["down"]) / paddle_width - 0.5
            game_state["ball"]["dx"] += impact_point * 4
            game_state["ball"]["dy"] = -abs(dy)

        # top player scores
        if ball_y < 0:
            game_state["score"]["p2"] += 1
            await self.reset_ball()
            if game_state["score"]["p2"] == 3:
                game_state["winner"] = room["players"]["down"].username
            await self.update_match_score(game_state["score"]["p1"], game_state["score"]["p2"])

        # bott player scores
        if ball_y > 725:
            game_state["score"]["p1"] += 1
            await self.reset_ball()
            if game_state["score"]["p1"] == 3:
                game_state["winner"] = room["players"]["up"].username
            await self.update_match_score(game_state["score"]["p1"], game_state["score"]["p2"])

    async def reset_ball(self):
        room = self.rooms[self.room_name]
        room["game_state"]["ball"] = {
            "x": 250,
            "y": 365,
            "dx": 5,
            "dy": 5,
        }
        await self.broadcast_game_state()

    async def broadcast_game_state(self):
        room = self.rooms[self.room_name]
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "game_update",
                "game_state": room["game_state"],
            },
        )

    async def broadcast_end_game(self, game_state):
        room = self.rooms[self.room_name]
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "game_end",
                "game_state": room["game_state"],
            },
        )
    
    async def game_end(self, event):
        await self.send(text_data=json.dumps(event))

    async def game_update(self, event):
        game_state = event["game_state"]
        await self.send(text_data=json.dumps(game_state))

    async def game_loop(self):
        while True:
            room = self.rooms[self.room_name]
            if room["game_state"]["score"]["p1"] == 3:
                await self.broadcast_end_game(room["game_state"])
                break
            if room["game_state"]["score"]["p2"] == 3:
                await self.broadcast_end_game(room["game_state"])
                break
            if room['players']['up'] == None or room['players']['down'] == None:
                await self.broadcast_end_game(room["game_state"])
                break
            await self.ball_moves()
            await self.broadcast_game_state()
            await asyncio.sleep(0.03)
