import json
from channels.generic.websocket import AsyncWebsocketConsumer

class MatchMakingConsumer(AsyncWebsocketConsumer):

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
        # print(f'game =======> MatchMakingConsumer: Connected to {self.room_name}')
        await self.accept()

    async def disconnect(self, close_code):
        if self.room_name in self.rooms:
            self.rooms[self.room_name].remove(self) 
            if not self.rooms[self.room_name]:
                del self.rooms[self.room_name]

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )
