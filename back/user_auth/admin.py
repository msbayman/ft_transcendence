# user_auth/admin.py

from django.contrib import admin
from .models import Player
from listfriends.models import Friend_request
admin.site.register(Player)
admin.site.register(Friend_request)
