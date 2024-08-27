import logging
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Player
from rest_framework.permissions import IsAuthenticated
from .serializers import PlayerSerializer

# Logger setup
logger = logging.getLogger(__name__)

@api_view(['GET'])
def index(request):
    return Response("Hello, world")

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def display_users(request):
    players = Player.objects.all()
    serializer = PlayerSerializer(players, many=True)
    return Response(serializer.data)

@api_view(['POST'])
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
def add_player(request):
    serializer = PlayerSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"detail": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request=request, username=username, password=password)

        if user is not None:
            player = Player.objects.get(username=username)
            
            if not player.active_2fa:
                print("0000000000ayman00000000")
                # If 2FA is disabled, proceed to login and generate tokens
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'redirect_to': '/My_profile'  # Specify the page to redirect to
                }, status=status.HTTP_200_OK)
            
            else:
                # If 2FA is enabled, return a response indicating that OTP verification is needed
                # You might send the OTP here in a real scenario
                return Response({
                    "detail": "2FA is enabled. Please verify with your OTP.",
                    "twofa_required": True,
                    "redirect_to": '/verify-otp'  # Specify the OTP verification page
                }, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid username or password."}, status=status.HTTP_401_UNAUTHORIZED)
        





class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'full_name': user.full_name,
        }
        return Response(data)
