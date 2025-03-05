from django.db import transaction
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import asyncio
from .models import Match
from user_auth.models import Player
import math

class Rps(AsyncWebsocketConsumer):
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
                    'up_choise': None,
                    'down_choise': None,
                    'score': {'p1': 0, 'p2': 0},
                    'winner': None,
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
            elif self.match.player2 == self.user.username:
                if room['players']['down'] is None:
                    room['players']['down'] = self.user

            # -------------------------
            if self.match.status == 2:
                await self.close()
                return
            
        except Exception as e:
            await self.close()
            return

        if room['players']['up'] and room['players']['down']:
            self.game_task = asyncio.create_task(self.game_loop())

    async def is_part_of_the_game(self, user, id):
        try:
            game = Match.objects.get(id=id)
            # Fix: Return True if user is part of the game
            if game.player1 == user.username or game.player2 == user.username:
                return True
        except Match.DoesNotExist:
            print(f"Match with ID {id} not found")
        except Exception as e:
            print(f"Error checking game participation: {e}")
        return False
             
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
            match = Match.objects.get(id=self.room_name)
            match.player1_score = score1
            match.player2_score = score2
            if match.player1_score == 3 or match.player2_score == 3:
                match.status = 2
            match.save()
        except Match.DoesNotExist:
            print(f"Match with ID {self.room_name} not found")
        except Exception as e:
            print(f"Error saving match score: {e}")

    @database_sync_to_async
    def save_user(self):
        self.user.save()

    async def update_user_after_game(self, winner, score):
        if self.user.username == winner:
            self.user.total_games += 1
            self.user.win_games += 1
            self.user.points += 300
            self.user.level = math.floor(self.user.points / 1000) + 1
    
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
            self.user.level = math.floor(self.user.points / 1000) + 1
                
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
        valid_types = {'rock', 'paper', 'scissor'}
        print(data)
        try:
            if data['choise'] not in valid_types:
                await self.send(text_data=json.dumps({"type": "error", "message": "Invalid type"}))
                return
                
            if room['players']['up'] == self.user:
                room['game_state']['up_choise'] = data['choise']
            if room['players']['down'] == self.user:
                room['game_state']['down_choise'] = data['choise']
                
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({"type": "error", "message": "Invalid JSON format"}))
            return
            
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
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "game_end",
                "game_state": game_state,
            },
        )
    
    async def game_end(self, event):
        await self.send(text_data=json.dumps(event))

    async def game_update(self, event):
        game_state = event["game_state"]
        await self.send(text_data=json.dumps(game_state))

    async def check_player_choise(self):
        while True:
            room = self.rooms[self.room_name]
            if room['game_state']['up_choise'] and room['game_state']['down_choise']:
                break
            await asyncio.sleep(0.1)

    async def game_logic(self):
        win_conditions = {
            ('rock', 'scissor'),
            ('scissor', 'paper'),
            ('paper', 'rock')
        }
        
        room = self.rooms[self.room_name]
        player_up_choise = room['game_state']['up_choise']
        player_down_choise = room['game_state']['down_choise']
        
        if player_up_choise == player_down_choise:
            # It's a tie, no winner should be set or handle tie logic
            pass
        elif (player_up_choise, player_down_choise) in win_conditions:
            room['game_state']['winner'] = room['players']['up'].username
            room['game_state']['score']['p1'] += 1
        else:
            room['game_state']['winner'] = room['players']['down'].username
            room['game_state']['score']['p2'] += 1
            
        room['game_state']['up_choise'] = None
        room['game_state']['down_choise'] = None

    async def game_loop(self):
        try:
            while True:
                room = self.rooms[self.room_name]
                await self.check_player_choise()
                await self.game_logic()
                
                # Check if game has ended (someone reached 3 points)
                if room['game_state']['score']['p1'] >= 3 or room['game_state']['score']['p2'] >= 3:
                    await self.update_match_score(room['game_state']['score']['p1'], room['game_state']['score']['p2'])
                    await self.broadcast_end_game(room['game_state'])
                    break
                
                await self.broadcast_game_state()
                await asyncio.sleep(0.03)
        except Exception as e:
            print(f"Error in game loop: {e}")