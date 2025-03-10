from django.db import transaction
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import asyncio
from .models import Match
from user_auth.models import Player
import math
import logging

logger = logging.getLogger(__name__)

class Rps(AsyncWebsocketConsumer):
    rooms = {}
    act_ply = {}

    async def connect(self):
        try:
            self.user = self.scope['user']
            self.room_name = self.scope["url_route"]["kwargs"]["id"]
            self.room_group_name = f'game_{self.room_name}'

            # Additional validation checks
            if not self.user.is_authenticated:
                await self.close()
                return

            # Check if user is already in an active game
            if self.user.username in self.act_ply:
                await self.close()
                return

            # Verify user is part of the game choice
            is_part_of_game = await self.is_part_of_the_game(self.user, self.room_name)
            if not is_part_of_game:
                await self.close()
                return

            await self.accept()

            # Initialize room if not exists
            if self.room_name not in self.rooms:
                self.rooms[self.room_name] = {
                    'game_state': {
                        'right_choice': None,
                        'left_choice': None,
                        'score': {'p1': 0, 'p2': 0},
                        'winner': None,
                        'draw': False,
                        'right_player': None,
                        'left_player': None,
                    },
                    'players': {
                        'right': None,
                        'left': None,
                    },
                }

            self.act_ply[self.user.username] = self.room_name

            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name,
            )

            room = self.rooms[self.room_name]
            try:
                self.match = await self.get_the_game_by_id(self.room_name)
                if not self.match:
                    await self.close()
                    return

                # Assign player position
                if self.match.player1 == self.user.username:
                    if room['players']['right'] is None:
                        room['players']['right'] = self.user
                        room['game_state']['right_player'] = self.user.username

                elif self.match.player2 == self.user.username:
                    if room['players']['left'] is None:
                        room['players']['left'] = self.user
                        room['game_state']['left_player'] = self.user.username

                # Check if game is already completed
                if self.match.status == 2:
                    await self.close()
                    return
                
            except Exception as e:
                logger.error(f"Error in connect method: {e}")
                await self.close()
                return

            # Start game loop if both players are present
            if room['players']['right'] and room['players']['left']:
                await self.broadcast_game_state(room['game_state'])
                self.game_task = asyncio.create_task(self.game_loop())

        except Exception as e:
            logger.error(f"Unexpected error in connect: {e}")
            await self.close()

    async def is_part_of_the_game(self, user, id):
        """Verify if the user is part of the game"""
        try:
            game = await self.get_the_game_by_id(id)
            return game and (game.player1 == user.username or game.player2 == user.username)
        except Exception as e:
            logger.error(f"Error checking game participation: {e}")
            return False
             
    @database_sync_to_async
    def get_the_game_by_id(self, match_id):
        """Retrieve game by ID"""
        try:
            return Match.objects.get(id=match_id)
        except Match.DoesNotExist:
            return None
        
    async def update_match_score(self, score1, score2):
        """Update match score"""
        if self.match:
            await self.save_match_score(score1, score2)

    @database_sync_to_async
    def save_match_score(self, score1, score2):
        """Save match score to database"""
        try:
            with transaction.atomic():
                match = Match.objects.select_for_update().get(id=self.room_name)
                match.player1_score = score1
                match.player2_score = score2
                # match.game_type = True
                if match.player1_score == 3 or match.player2_score == 3:
                    match.status = 2
                match.save()
        except Match.DoesNotExist:
            logger.error(f"Match with ID {self.room_name} not found")
        except Exception as e:
            logger.error(f"Error saving match score: {e}")

    @database_sync_to_async
    def save_user(self):
        """Save user updates"""
        self.user.save()

    async def update_user_after_game(self, winner, score):
        """Update user statistics after game"""
        self.user.total_games += 1
        
        if self.user.username == winner:
            self.user.win_games += 1
            self.user.points += 300
            self.user.level = math.floor(self.user.points / 1000) + 1
    
            # Update achievement flags
            achievement_milestones = [
                (1, 'win_1_game'),
                (3, 'win_3_games'),
                (10, 'win_10_games'),
                (30, 'win_30_games')
            ]
            
            for milestone, flag in achievement_milestones:
                if self.user.win_games == milestone:
                    setattr(self.user, flag, True)
            
            # Level-based achievements
            level_milestones = [
                (5, 'reach_level_5'),
                (15, 'reach_level_15'),
                (30, 'reach_level_30')
            ]
            
            for level, flag in level_milestones:
                if self.user.level > level:
                    setattr(self.user, flag, True)
            
            # Perfect win
            if score == 0:
                self.user.perfect_win_game = True
        else:
            self.user.lose_games += 1
        
        await self.save_user()
    
    async def disconnect(self, close_code):
        """Handle disconnection"""
        try:
            if self.user.username in self.act_ply:
                del self.act_ply[self.user.username]

            if not self.rooms.get(self.room_name):
                return

            room = self.rooms[self.room_name]
            game_state = room["game_state"]

            # If game not finished, determine winner based on disconnection
            if not game_state["winner"]:
                if room['players']['right'] == self.user:
                    game_state["winner"] = room['players']['left'].username if room['players']['left'] else None
                    game_state["score"]["p2"] = 3
                    game_state["score"]["p1"] = 0
                elif room['players']['left'] == self.user:
                    game_state["winner"] = room['players']['right'].username if room['players']['right'] else None
                    game_state["score"]["p1"] = 3
                    game_state["score"]["p2"] = 0
                
            if not game_state["draw"]:
                await self.update_match_score(game_state["score"]["p1"], game_state["score"]["p2"])
                await self.update_user_after_game(game_state["winner"], game_state["score"]["p2"])
            await self.broadcast_end_game(game_state)
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

            # Clean right room if no players
            if not any(room['players'].values()):
                del self.rooms[self.room_name]
        
        except Exception as e:
            logger.error(f"Error in disconnect: {e}")

    async def receive(self, text_data):
        """Handle incoming WebSocket messages"""
        try:
            room = self.rooms[self.room_name]
            data = json.loads(text_data)
            valid_types = {'rock', 'paper', 'scissor'}

            # Validate choice
            if data['choice'] not in valid_types:
                await self.send(text_data=json.dumps({"type": "error", "message": "Invalid type"}))
                return
                
            # Set player choice based on position
            if room['players']['right'] == self.user:
                room['game_state']['right_choice'] = data['choice']
                
            if room['players']['left'] == self.user:
                room['game_state']['left_choice'] = data['choice']
                
            # Broadcast game state if both players have made a choice
            
            if room['game_state']['right_choice'] and room['game_state']['left_choice']:
                await self.game_logic()
                await self.broadcast_game_state(room['game_state'])

        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({"type": "error", "message": "Invalid JSON format"}))
        except Exception as e:
            logger.error(f"Error in receive method: {e}")

    async def broadcast_game_state(self, game_state):
        """Broadcast current game state to all players"""
        room = self.rooms[self.room_name]
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "game_update",
                "game_state": game_state,
            },
        )
        room['game_state']['right_choice'] = None
        room['game_state']['left_choice'] = None
        room['game_state']['winner'] = None
        room['game_state']['draw'] = False

    async def broadcast_end_game(self, game_state):
        """Broadcast game end to all players"""
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "game_end",
                "game_state": game_state,
            },
        )
    
    async def game_end(self, event):
        """Send game end event to specific player"""
        response_data = {
            "type":"game_end",
            "game_state": event["game_state"]
        }
        await self.send(text_data=json.dumps(response_data))


    async def game_update(self, event):
        """Send game update to specific player"""
        response_data = {
            "type":"game_update",
            "game_state": event["game_state"]
        }
        await self.send(text_data=json.dumps(response_data))

    async def check_player_choice(self):
        """Wait for both players to make a choice"""
        while True:
            room = self.rooms[self.room_name]
            if room['game_state']['right_choice'] and room['game_state']['left_choice']:
                break
            await asyncio.sleep(0.1)

    async def game_logic(self):
        """Determine game round winner"""
        win_conditions = {
            ('rock', 'scissor'),
            ('scissor', 'paper'),
            ('paper', 'rock')
        }
        
        room = self.rooms[self.room_name]
        player_right_choice = room['game_state']['right_choice']
        player_left_choice = room['game_state']['left_choice']
        
        if player_right_choice == player_left_choice:
            room['game_state']['draw'] = True
        elif (player_right_choice, player_left_choice) in win_conditions:
            # room['game_state']['winner'] = room['players']['right'].username
            room['game_state']['score']['p1'] += 1
        else:
            # room['game_state']['winner'] = room['players']['left'].username
            room['game_state']['score']['p2'] += 1
            

    async def game_loop(self):
        """Main game loop"""
        try:
            while True:
                room = self.rooms[self.room_name]
                # await self.check_player_choice()
                # await self.game_logic()
                
                # Check if game has ended (someone reached 3 points)
                if room['game_state']['score']['p1'] >= 3 or room['game_state']['score']['p2'] >= 3:
                    await self.update_match_score(room['game_state']['score']['p1'], room['game_state']['score']['p2'])
                    room['game_state']['winner'] = room['players']['right'].username if room['game_state']['score']['p1'] > room['game_state']['score']['p2'] else room['players']['left'].username

                    await self.broadcast_end_game(room['game_state'])
                    break
                # elif room['game_state']['draw']:
                # await self.broadcast_game_state(room['game_state'])
                await asyncio.sleep(0.03)
        except Exception as e:
            logger.error(f"Error in game loop: {e}")