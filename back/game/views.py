from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .models import Match
from .serializer import MatchSerializer

from .serializer import PlayerSerializer
from user_auth.models import Player

@api_view(['GET'])
def get_username_for_players(request):
    matchs = Match.objects.all()
    Mserializer = MatchSerializer(matchs, many=True).data
    return Response(Mserializer)

@api_view(['GET'])
def get_players(request):
    ply = Player.objects.all()
    Pserializer = PlayerSerializer(ply, many=True).data
    return Response(Pserializer)

@api_view(['POST'])
def post_username_for_players(request):
    data = request.data
    Mserializer = MatchSerializer(data=data)
    if Mserializer.is_valid():
        Mserializer.save()
        return Response(Mserializer.data, status=status.HTTP_201_CREATED)
    return Response(Mserializer.error, status=status.HTTP_400_BAD_REQUEST)