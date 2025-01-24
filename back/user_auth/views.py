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
from .otp_view import generate_otp , send_otp_via_email
from django.utils import timezone
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model
from django.db import transaction
import logging


# Logger setup
logger = logging.getLogger(__name__)

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

logger = logging.getLogger(__name__)

@api_view(['POST'])
def update_player(request):
    username = request.user.username
    new_username = request.data.get('username')
    
    logger.info(f"Attempting to update username from {username} to {new_username}")

    if not new_username:
        logger.warning("New username not provided in request")
        return Response({'error': 'Username is required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        with transaction.atomic():
            # Check if new username already exists
            if Player.objects.filter(username=new_username).exists():
                logger.warning(f"Username {new_username} already exists")
                return Response(
                    {'error': 'This username is already taken.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            player_to_update = Player.objects.get(username=username)
            logger.debug(f"Found player to update: {player_to_update}")

            # Update username
            player_to_update.username = new_username
            player_to_update.save()
            
            logger.info(f"Successfully updated username to {new_username}")
            
            # Return the updated player data
            return Response({
                'message': 'Username updated successfully',
                'username': new_username
            }, status=status.HTTP_200_OK)

    except Player.DoesNotExist:
        logger.error(f"Player not found with username: {username}")
        return Response(
            {'error': 'Player not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error updating player {username}: {str(e)}", exc_info=True)
        return Response(
            {'error': 'An error occurred while updating the username'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    

@api_view(['POST'])
def add_player(request):
    email = request.data.get('email', '').strip().lower()  # Normalize email
    username = request.data.get('username', '').strip()  # Normalize username

    if not email or not username:
        return Response({"error": "Email and username are required."}, status=status.HTTP_400_BAD_REQUEST)

    # Check if the email or username is already in use
    if Player.objects.filter(email__iexact=email).exists() or Player.objects.filter(username__iexact=username).exists():
        return Response({"error": "That email or username is already used."}, status=status.HTTP_409_CONFLICT)

    # Validate and save the player
    serializer = PlayerSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # Return validation errors
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
            player.is_online = True
            player.save()
            if not player.prov_name:
                player.prov_name = 'simple'
                player.save()
            
            if not player.active_2fa:
                # If 2FA is disabled, proceed to login and generate tokens
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'redirect_to': '/Overview'  # Specify the page to redirect to
                }, status=status.HTTP_200_OK)
            
            else:
                # If 2FA is enabled, generate and send OTP
                otp_code = generate_otp()
                send_otp_via_email(user.email, otp_code)  # Send OTP via email
                
                # Store OTP in the player's record
                player.otp_code = otp_code
                player.created_at = timezone.now()
                player.save()

                return Response({
                    "twofa_required": True,
                    "username": player.username,
                    "redirect_to": '/Valid_otp'  # Specify the OTP verification page
                }, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid username or password."}, status=status.HTTP_401_UNAUTHORIZED)


class VerifyOTP(APIView):
    def post(self, request):
        username = request.data.get('username')
        otp = request.data.get('otp')
        print(otp)

        if not username or not otp:
            return Response({"detail": "Username and OTP are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            player = Player.objects.get(username=username)
        except Player.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # Check if the OTP has expired
        if player.is_expired():
            return Response({"detail": "OTP has expired."}, status=status.HTTP_400_BAD_REQUEST)

        # Verify the OTP
        if player.otp_code == otp:
            # OTP is correct, proceed to login and generate tokens
            # Since the OTP is correct, you may directly authenticate the user without checking the password again
            refresh = RefreshToken.for_user(player)  # Assuming `player` is the user instance

            # Clear the OTP after successful verification
            player.otp_code = 0
            player.is_online = True
            player.save()

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'redirect_to': '/Overview'  # Redirect to the profile page after successful login
            }, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)



class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        users = request.user
        users.is_online = True
        users.save();
        serializer = PlayerSerializer(users , context = {"request": request})
        return Response( serializer.data )


@api_view(['GET'])
def list_users(request):
    players = Player.objects.all()
    serializer = PlayerSerializer(players, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def leaderboard(request):
    players = Player.objects.all().exclude(username='admin').order_by('-points')
    serializer = PlayerSerializer(players, many=True)
    return Response(serializer.data)

# @api_view(['GET'])
class is_online(APIView):
    authentication_classes = [JWTAuthentication]
    def get(self, request):
        players = Player.objects.all().filter(is_online=True)
        serializer = PlayerSerializer(players, many=True)
        return Response(serializer.data)


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            player = Player.objects.get(username=user.username)  # Get the Player instance
            player.is_online = False  # Set is_online to False
            player.save()  # Save the changes


            return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Player.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error during logout: {e}")
            return Response({"detail": "An error occurred during logout."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
