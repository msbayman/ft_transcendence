import logging
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Player
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import PlayerSerializer
from .otp_view import generate_otp, send_otp_via_email
from django.utils import timezone
from django.http import JsonResponse


# Logger setup
logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return JsonResponse({"status": "ok"})




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def display_users(request):
    players = Player.objects.all()
    serializer = PlayerSerializer(players, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_player(request):
    username = request.data.get('username')
    if not username:
        return Response({'error': 'Username is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        player_to_delete = Player.objects.get(username=username)
        player_to_delete.delete()
        return Response({'message': f'Player {username} deleted successfully'}, status=status.HTTP_200_OK)
    except Player.DoesNotExist:
        return Response({'error': 'Player not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error deleting player {username}: {e}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_player(request):
    username = request.data.get('username')
    if not username:
        return Response({'error': 'Username is required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        player_to_update = Player.objects.get(username=username)
        serializer = PlayerSerializer(player_to_update, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Player.DoesNotExist:
        return Response({'error': 'Player not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error updating player {username}: {e}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def add_player(request):
    email = request.data.get('email', '').strip().lower()
    username = request.data.get('username', '').strip()

    if not email or not username:
        return Response({"error": "Email and username are required."}, status=status.HTTP_400_BAD_REQUEST)

    if Player.objects.filter(email__iexact=email).exists() or Player.objects.filter(username__iexact=username).exists():
        return Response({"error": "That email or username is already used."}, status=status.HTTP_409_CONFLICT)

    serializer = PlayerSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"detail": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request=request, username=username, password=password)

        if user is not None:
            player = Player.objects.get(username=username)
            if not player.prov_name:
                player.prov_name = 'simple'
                player.save()
            
            if not player.active_2fa:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'redirect_to': '/Overview'
                }, status=status.HTTP_200_OK)
            
            else:
                otp_code = generate_otp()
                send_otp_via_email(user.email, otp_code)
                
                player.otp_code = otp_code
                player.created_at = timezone.now()
                player.save()

                return Response({
                    "twofa_required": True,
                    "username": player.username,
                    "redirect_to": '/Valid_otp'
                }, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid username or password."}, status=status.HTTP_401_UNAUTHORIZED)

class VerifyOTP(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        otp = request.data.get('otp')

        if not username or not otp:
            return Response({"detail": "Username and OTP are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            player = Player.objects.get(username=username)
        except Player.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if player.is_expired():
            return Response({"detail": "OTP has expired."}, status=status.HTTP_400_BAD_REQUEST)

        if player.otp_code == otp:
            refresh = RefreshToken.for_user(player)

            player.otp_code = 0
            player.save()

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'redirect_to': '/Overview'
            }, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        serializer = PlayerSerializer(user, context={"request": request})
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def list_users(request):
    players = Player.objects.all()
    serializer = PlayerSerializer(players, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def leaderboard(request):
    players = Player.objects.all().order_by('-points')
    serializer = PlayerSerializer(players, many=True)
    return Response(serializer.data)