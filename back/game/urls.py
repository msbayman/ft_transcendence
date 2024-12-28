from django.urls import path
from .views import Game_api_View


urlpatterns = [
    path('remote/', Game_api_View.as_view(), name='game_api'),
]