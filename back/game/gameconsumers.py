import json
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio


class GameConsumer(AsyncWebsocketConsumer):
    game_state = {
        'ball': {'x': 250, 'y': 365, 'dx': 4, 'dy': 4},
        'paddles': {'up': 180, 'down': 180},
        'score': {'p1': 0, 'p2': 0},
    }

    players = {
        'up': None,
        'down': None,
    }

    async def connect(self):
        self.user = self.scope['user']
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f'game_{self.room_name}'

        if not self.user.is_authenticated:
            await self.close()
            return

        if self.players['up'] is None:
            self.players['up'] = self.user
        elif self.players['down'] is None:
            self.players['down'] = self.user
        else:
            await self.close()
            return
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )
        await self.accept()
        if (len([player for player in self.players.values() if player]) == 2):
            if self.players['down'] == self.user:
                self.game_task = asyncio.create_task(self.game_loop())

    async def disconnect(self, close_code):
        if self.players['up'] == self.user:
            self.players['up'] = None
        elif self.players['down'] == self.user:
            self.players['down'] = None
        
        await self.send(text_data=json.dumps({
            'game_status': 'disconnected',
            'player': 'up' if self.players['up'] == self.user else 'down'
        }))

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        if "paddle" in data:
            paddle = data["paddle"]

        if self.user == self.players['up']:
            if paddle == "upP":
                self.game_state["paddles"]["up"] =  max(5, min(365, self.game_state["paddles"]["up"] - 20))
            elif paddle == "upD":
                self.game_state["paddles"]["up"] =  max(5, min(365, self.game_state["paddles"]["up"] + 20))
            elif paddle == "reset":
                self.game_state["paddles"]["down"] = 150
                self.game_state["paddles"]["up"] = 150
        elif self.user == self.players['down']:
            if paddle == "upP":
                self.game_state["paddles"]["down"] =  max(5, min(365, self.game_state["paddles"]["down"] - 20))
            elif paddle == "upD":
                self.game_state["paddles"]["down"] =  max(5, min(365, self.game_state["paddles"]["down"] + 20))
            elif paddle == "reset":
                self.game_state["paddles"]["down"] = 150
                self.game_state["paddles"]["up"] = 150
                self.reset_ball()
        await self.broadcast_game_state()

    async def ball_moves(self):
        self.game_state["ball"]["x"] += self.game_state["ball"]["dx"]
        self.game_state["ball"]["y"] += self.game_state["ball"]["dy"]

        ball_x = self.game_state["ball"]["x"]
        ball_y = self.game_state["ball"]["y"]
        dx = self.game_state["ball"]["dx"]
        dy = self.game_state["ball"]["dy"]

        # walls collision
        if ball_x <= 0 or ball_x >= 490:
            self.game_state["ball"]["dx"] = -dx

        paddle_width = 155

        # Ball collision (top paddle)
        if (
            ball_y <= 27 and
            ball_x >= self.game_state["paddles"]["up"] and
            ball_x <= self.game_state["paddles"]["up"] + paddle_width
        ):
            impact_point = (ball_x - self.game_state["paddles"]["up"]) / paddle_width - 0.5
            self.game_state["ball"]["dx"] += impact_point * 4
            self.game_state["ball"]["dy"] = abs(dy)

        # Ball collision (bott paddle)
        if (
            ball_y >= 700 and
            ball_x >= self.game_state["paddles"]["down"] and
            ball_x <= self.game_state["paddles"]["down"] + paddle_width
        ):
            impact_point = (ball_x - self.game_state["paddles"]["down"]) / paddle_width - 0.5
            self.game_state["ball"]["dx"] += impact_point * 4
            self.game_state["ball"]["dy"] = -abs(dy)

        # top player scores
        if ball_y < 0:
            self.game_state["score"]["p1"] += 1
            await self.reset_ball()

        # bott player scores
        if ball_y > 725:
            self.game_state["score"]["p2"] += 1
            await self.reset_ball()

    async def reset_ball(self):
        self.game_state["ball"] = {
            "x": 250,
            "y": 365,
            "dx": 3,
            "dy": 3
        }

    async def broadcast_game_state(self):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "game_update",
                "game_state": self.game_state,
            }
        )

    async def game_update(self, event):
        game_state = event["game_state"]
        await self.send(text_data=json.dumps(game_state))

    async def game_loop(self):
        while True:
            await self.ball_moves()
            await self.broadcast_game_state()
            await asyncio.sleep(0.03)