import json
from channels.generic.websocket import AsyncWebsocketConsumer


class EchoConsumer(AsyncWebsocketConsumer):
    game_state = {
        'ball': {'x': 0, 'y': 0, 'dx': 3, 'dy': 3},
        'left_paddle': {'x': 10, 'y': 150, 'width': 10, 'height': 100},
        'right_paddle': {'x': 780, 'y': 150, 'width': 10, 'height': 100},
    }

    rooms = {}

    async def connect(self):
        self.room_name = None

        for room, players in self.rooms.items():
            if len(players) < 2:
                self.room_name = room
                players.append(self)
                break
        nbr_room = len(self.rooms) + 1
        if not self.room_name:
            self.room_name = f"room_{nbr_room}"
            self.rooms[self.room_name] = [self] 

        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        if self.room_name in self.rooms:
            self.rooms[self.room_name].remove(self)
            if not self.rooms[self.room_name]:
                del self.rooms[self.room_name]

    async def receive(self, text_data):
        data = json.loads(text_data)

