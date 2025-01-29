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

@api_view(['GET'])
def get_username_for_players(request):
    matchs = Match.objects.all()
    Mserializer = MatchSerializer(matchs, many=True).data
    return Response(Mserializer)


class UserMatchHistoryView(ListAPIView):
    serializer_class = MatchHistorySerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        try:
            username = self.kwargs.get('username')
            return Match.objects.filter(
                Q(player1=username) | Q(player2=username)
            ).order_by('-date')
        except Exception as e:
            raise Http404("this given username not found")

# class get_matches_by_username(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, username):
#         matches = Match.objects.filter(player1=username).order_by('date')

#         if not matches:
#             return Response({'error','no matches'}, status=status.HTTP_404_NOT_FOUND)

#         match_data = [
#             {
#                 "player1": match.player1,
#                 "player2": match.player2,
#                 "player1_score": match.player1_score,
#                 "player2_score": match.player2_score,
#                 "status": match.status,
#                 "date": match.date
#             }
#             for match in matches
#         ]
#         return Response(match_data, status=status.HTTP_200_OK)


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