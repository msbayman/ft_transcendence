import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.db import transaction
from channels.db import database_sync_to_async
from .models import Match

class tournconsumer(AsyncWebsocketConsumer):
    