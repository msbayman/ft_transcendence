from rest_framework import serializers
from .models import Match
from user_auth.models import Player

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = '__all__'


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'username']


class MatchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = [
            'game_type',
            'player1',
            'player2',
            'player1_score',
            'player2_score',
            'date',
        ]
