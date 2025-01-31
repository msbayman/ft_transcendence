
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import asyncio
from .models import Match
from user_auth.models import Player
import math

# check if you have per and game was ended (done)
# check if user are already playnig and he disconnect (momkin tkherejhom bjoj)

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
        
        if self.user.username in self.act_ply:
            await self.close()
            return

        if self.room_name not in self.rooms:
            self.rooms[self.room_name] = {
                'game_state': {
                    'ball': {'x': 250, 'y': 365, 'dx': 5, 'dy': 5},
                    'paddles': {'up': 180, 'down': 180},
                    'score': {'p1': 0, 'p2': 0},
                    'winner' : None,
                    'side': {'up': None, 'down': None}
                },
                'players': {
                    'up': None,
                    'down': None,
                },
            }

        room = self.rooms[self.room_name]
        game_state = room["game_state"]
        if room['players']['up'] is None:
            room['players']['up'] = self.user
            game_state["side"]["up"] = room['players']['up'].username
        elif room['players']['down'] is None:
            room['players']['down'] = self.user
            game_state["side"]["down"] = room['players']['down'].username
        else:
            await self.close()
            return

        self.act_ply[self.user.username] = self.room_name

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )
        await self.accept()

        try:
            self.match = await self.get_the_game_by_id(self.room_name)
            if not self.match:
                await self.close()
                return
        except Exception as e:
            print(f"Error retrieving match: {e}")
            await self.close()
            return

        if all(room['players'].values()):
            print(self.user)
            if room['players']['down'] == self.user:
                self.game_task = asyncio.create_task(self.game_loop())
                self.game_task.add_done_callback(self.call_back)

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


    def call_back(self, game_task):
        try:
            game_task.result()
        except Exception as e:
            print(f"Error - task - : {e}")
             
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
            match.save()
        except Match.DoesNotExist:
            print(f"Match with ID {self.room_name} not found")
        except Exception as e:
            print(f"Error saving match score: {e}")

    
#--------------------------------------------------------------------------------------
    async def disconnect(self, close_code):
        print(f"player {self.user.username} disconnected")

        if self.user.username in self.act_ply:
            del self.act_ply[self.user.username]

        if not self.rooms.get(self.room_name):
            return

        room = self.rooms[self.room_name]
        game_state = room["game_state"]

        if game_state["winner"]:

            winner = await Player.objects.aget(username=game_state["winner"])
            loser = await Player.objects.aget(username=self.user.username) 

            winner.total_games += 1
            winner.win_games += 1
            winner.points += 300
            winner.level = math.floor( winner.points / 1000 ) + 1
            print(f"winner is: {winner.username} and he won {winner.points} and his level is : {winner.level}")

            loser.total_games += 1
            loser.lose_games += 1
            loser.level = math.floor( loser.points / 1000 ) + 1
            print(f"loser is: {loser.username} and he lose with {loser.points} and his level is : {loser.level}")

            if winner.win_games == 1:
                winner.win_1_game = True
            if winner.win_games == 3:
                winner.win_3_games = True
            if winner.win_games == 10:
                winner.win_10_games = True
            if winner.win_games == 30:
                winner.win_30_games = True
            if winner.level > 5:
                winner.reach_level_5 = True
            if winner.level > 15:
                winner.reach_level_15 = True
            if winner.level > 30:
                winner.reach_level_30 = True
            if game_state["score"]["p2"] == 0:
                winner.perfect_win_game = True


            await loser.asave()
            await winner.asave()

            await self.broadcast_end_game(game_state)
        else:
            if room['players']['up'] == self.user:
                game_state["winner"] = room['players']['down'].username if room['players']['down'] else None
                game_state["score"]["p2"] = 3
                game_state["score"]["p1"] = 0
            elif room['players']['down'] == self.user:
                game_state["winner"] = room['players']['up'].username if room['players']['up'] else None
                game_state["score"]["p1"] = 3
                game_state["score"]["p2"] = 0

            await self.update_match_score(game_state["score"]["p1"], game_state["score"]["p2"])
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

        paddle_width = 155

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
            "dx": 3,
            "dy": 3,
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
        # end_game_message = event["end_game"]
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
