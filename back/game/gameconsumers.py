import json
from channels.generic.websocket import AsyncWebsocketConsumer


class GameConsumer(AsyncWebsocketConsumer):
    game_state = {
        'ball': {'x': 0, 'y': 0, 'dx': 3, 'dy': 3},
        'left_paddle': {'x': 10, 'y': 150},
        'right_paddle': {'x': 780, 'y': 150},
    }

    async def connect(self):
        if self.scope['user'].is_atuhenticated:
            print(f'game ==> GameConsumer: User authenticated as {self.scope["user"]}')
            await self.accept()
        else:
            print('game ==> GameConsumer: User not authenticated')
            await self.close()

    async def disconnect(self, close_code):
        print('game ==> GameConsumer: Connection closed')
