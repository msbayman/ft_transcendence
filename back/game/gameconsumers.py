import json
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio


class GameConsumer(AsyncWebsocketConsumer):
    game_state = {
        'ball': {'x': 0, 'y': 0, 'dx': 3, 'dy': 3},
        'paddles': {'up': 150, 'down': 150},
        'score': {'left': 0, 'right': 0},
    }

    async def connect(self):
        self.user = self.scope['user']
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f'game_{self.room_name}'

        print(f'>>>>>>>>>>> User connected to room {self.room_name} >>>>>>>>>>>>>>')
        print(f'>>>>>>>>>>> User connected as {self.user} >>>>>>>>>>>>>>')
        if not self.user.is_authenticated:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )
        await self.accept()
        self.game_task = asyncio.create_task(self.game_loop())

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        data = json.loads(text_data)
        if "paddle" in data:
            paddle = data["paddle"]
            # position = data["position"]

            if paddle == "upP":
                self.game_state["paddles"]["up"] =  max(5, min(356, self.game_state["paddles"]["up"] + 20))
            elif paddle == "upM":
                self.game_state["paddles"]["up"] =  max(5, min(356, self.game_state["paddles"]["up"] - 20))
            elif paddle == "reset":
                self.game_state["paddles"]["down"] = 150
                self.game_state["paddles"]["up"] = 150


        await self.broadcast_game_state()

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
        # while True: 
            await self.broadcast_game_state()
            await asyncio.sleep(0.03)