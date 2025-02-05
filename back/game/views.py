from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from .serializer import MatchHistorySerializer
from django.db.models import Q
from django.http import Http404
from .models import Match
from .serializer import MatchSerializer
from .serializer import PlayerSerializer
from user_auth.models import Player
from django.utils import timezone
from datetime import timedelta

class UserMatchHistoryView(ListAPIView):
    serializer_class = MatchHistorySerializer
    permission_classes = [IsAuthenticated]
    # authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        try:
            username = self.kwargs.get('username')
            return Match.objects.filter(
                Q(player1=username) | Q(player2=username)
            ).order_by('-date')
        except Exception as e:
            raise Http404("this given username not found")

@api_view(['GET'])
def get_username_for_players(request):
    matchs = Match.objects.all()
    Mserializer = MatchSerializer(matchs, many=True).data
    return Response(Mserializer)

class Last_5_Days(ListAPIView):
    serializer_class = MatchHistorySerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        five_days_ago = timezone.now() - timedelta(days=5)
        username = self.kwargs.get('username')

        try:
            player = Player.objects.get(username=username)
        except Player.DoesNotExist:
            raise Http404("Player with the given username not found")

        list_matches = Match.objects.filter(
            (Q(player1=username) | Q(player2=username)) & Q(date__gte=five_days_ago)
        ).order_by('-date')

        return list_matches



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