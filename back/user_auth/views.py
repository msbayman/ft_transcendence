import logging
import time
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, password_validation
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError
from .models import Player
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import PlayerSerializer
from .otp_view import generate_otp, send_otp_via_email, store_otp
from django.utils import timezone
from django.db import transaction
from django.http import JsonResponse
from datetime import timedelta
from django.core.files import File
from django.utils.timezone import now
import requests
from django.http import JsonResponse
from django.core.management.base import BaseCommand
from django.utils import timezone
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.mail import send_mail
from django.core.files.temp import NamedTemporaryFile
from django.conf import settings
from rest_framework import serializers, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import make_password
from django.db.models import Q
import math
from game.models import Match
from django.shortcuts import get_object_or_404

logger = logging.getLogger(__name__)

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
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_player(request):
    old_username = username = request.user.username
    new_username = request.data.get('username')


    if not new_username or new_username == '':
        return Response(
                {'error': 'no username'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    if not new_username or len(new_username) < 4 or len(new_username) > 40 or new_username == 'admin':
        if len(new_username) < 4:
            return Response({'error': 'Username must be at least 4 characters long.'}, status=status.HTTP_400_BAD_REQUEST)
        if len(new_username) > 14:
            return Response({'error': 'Username must be at most 14 characters long.'}, status=status.HTTP_400_BAD_REQUEST)
        if new_username == 'admin':
            return Response({'error': 'Username cannot be "admin".'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'error': 'Username is required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Use the serializer's validation method to validate the new username
        serializer = PlayerSerializer()
        validated_username = serializer.validate_username(new_username)

        if Player.objects.filter(username=validated_username).exists():
            return Response(
                {'error': 'This username is already taken.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Fetch the player and update the username
        player_to_update = Player.objects.get(username=username)
        player_to_update.username = validated_username
        player_to_update.save()
        

        games = Match.objects.filter(Q(player1=old_username) | Q(player2=old_username))
        
        for i in games:
            if i.player1 == old_username:
                i.player1 = new_username
                i.save()
            else:
                i.player2 = new_username
                i.save()

        return Response({
            'message': 'Username updated successfully',
            'username': validated_username
        }, status=status.HTTP_200_OK)

    except ValidationError as e:
        return Response({'error': str(e.detail[0])}, status=status.HTTP_400_BAD_REQUEST)
    except Player.DoesNotExist:
        return Response(
            {'error': 'Player not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': 'An error occurred while updating the username'},
            status=status.HTTP_400_BAD_REQUEST
        )
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def changePassword(request):
    """
    Change password endpoint for authenticated users.
    Requires old_password and new_password in request data.
    """
    try:
        # Get data from request
        username = request.data.get('username')
        new_password = request.data.get('newPassword')
        old_password = request.data.get('oldPassword')

        # Validate input data  
        if not all([username, new_password, old_password]):
            return Response({
                'error': 'Username, old password, and new password are required.'
            }, status=status.HTTP_400_BAD_REQUEST)

        if not new_password.strip():  # Check for empty or all spaces
            return Response({
                'error': 'Password cannot be empty or just spaces.'
            }, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password) < 6:
            return Response({
                'error': 'Password must be at least 6 characters long.'
            }, status=status.HTTP_400_BAD_REQUEST)


        # Get the player instance
        try:
            player = Player.objects.get(username=username)
        except Player.DoesNotExist:
            return Response({
                'error': 'Player not found'
            }, status=status.HTTP_404_NOT_FOUND)

        # Verify the requesting user matches the username
        if request.user.username != username:
            return Response({
                'error': 'Unauthorized to change password for this user'
            }, status=status.HTTP_403_FORBIDDEN)

        # check for the player with prov_name 42
        if player.prov_name == '42':
            return Response({
                'error': 'You cannot change the password'
            }, status=status.HTTP_403_FORBIDDEN)
        # Verify old password
        if not player.check_password(old_password):
            return Response({
                'error': 'Current password is incorrect'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Validate new password
        try:
            validate_password(new_password, player)
        except ValidationError as e:
            return Response({
                'error': ' '.join(e.messages)
            }, status=status.HTTP_400_BAD_REQUEST)

        # Check if new password is same as old password
        if old_password == new_password:
            return Response({
                'error': 'New password must be different from current password'
            }, status=status.HTTP_400_BAD_REQUEST)

        player.set_password(new_password)
        player.save()

        return Response({
            'success': True,
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            'error': 'An error occurred while updating the password'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def add_player(request):

    one_day_ago = now() - timedelta(minutes=20)
    Player.objects.filter(is_validate=False, created_at__lt=one_day_ago).delete()


    email = request.data.get('email', '').strip().lower()
    username = request.data.get('username', '').strip().lower()
    if not email or not username:
        return Response({"error": "Email and username are required."}, status=status.HTTP_400_BAD_REQUEST)

    existing_email = Player.objects.filter(email__iexact=email).exists()
    existing_username = Player.objects.filter(username__iexact=username).exists()

    if existing_email or existing_username:
        return Response({
            "error": "Conflict",
            "details": {
                "email_exists": existing_email,
                "username_exists": existing_username
            }
        }, status=status.HTTP_409_CONFLICT)



    serializer = PlayerSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginAPIView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            username = request.data.get('username').lower()
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
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            

class VerifyOTP(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
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
                player.is_online = True
                player.is_validate = True
                player.save()

                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'redirect_to': '/Overview'
                }, status=status.HTTP_200_OK)
            else:
                return Response({"detail": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class SendOtpForSettings(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Retrieve the authenticated user
            user = request.user
            if not isinstance(user, Player):
                return Response({"error": "Invalid user type."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Generate a 6-digit OTP
            # if time.time() - user.created_at > 300:  # 5 minutes
            #     return Response({"detail": "OTP has expired, wait 5 min"}, status=status.HTTP_404_BAD_REQUEST)
            otp = generate_otp()
            user.otp_code = otp
            user.created_at = now()  # Update the OTP creation timestamp
            user.save()
            send_otp_via_email(user.email, otp)
            return Response({"message": "OTP sent successfully."}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
class VerifyOTPSettings(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        username = request.data.get('username')
        state = request.data.get('state')
        otp = request.data.get('otp')

        if not username and not state:
            return Response({"detail": "Username, State are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            player = Player.objects.get(username=username)
        except Player.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if player.is_expired():
            return Response({"detail": "OTP has expired."}, status=status.HTTP_404_BAD_REQUEST)

        if player.otp_code == otp:
            player.active_2fa = not state
            player.otp_code = 0
            player.save(update_fields=['active_2fa'])
            return Response({"message": "OTP verified successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_2fa_status(request):
    try:
        # Since we're using JWT authentication, the user is already attached to the request
        user = request.user
        
        # Return the 2FA status from the active_2fa field
        return Response({
            'is2FAEnabled': user.active_2fa
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': 'Failed to fetch 2FA status',
            'detail': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        users = request.user
        # users.is_online = True
        users.save()
        serializer = PlayerSerializer(users , context = {"request": request})
        return Response( serializer.data )


# @api_view(['GET'])
# @permission_classes([AllowAny])
# def list_users(request):
#     players = Player.objects.all()
#     serializer = PlayerSerializer(players, many=True)
#     return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def leaderboard(request):
    players = Player.objects.all().exclude(username='admin').order_by('-points')
    serializer = PlayerSerializer(players, many=True)
    return Response(serializer.data)

# @api_view(['GET'])
class is_online(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get(self, request):
        players = Player.objects.all().filter(is_online=True)
        serializer = PlayerSerializer(players, many=True)
        return Response(serializer.data)


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self, request):
        try:
            user = request.user
            player = Player.objects.get(username=user.username)
            player.is_online = False
            player.save()


            return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Player.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": "An error occurred during logout."}, status=status.HTTP_400_BAD_REQUEST)



class GetPlayer(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        try:
            data_player = Player.objects.get(username=username)
            serializer = PlayerSerializer(data_player)
            return Response(serializer.data)
        except Player.DoesNotExist:
            return Response({"error": "No player found with this username"}, status=status.HTTP_404_NOT_FOUND)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_profile_image(request):
    try:
        username = request.user.username
        player = Player.objects.get(username=username)
        
        if 'profile_image' not in request.FILES:
            return Response({'error': 'No image file provided'}, status=400)
            
        image_file = request.FILES['profile_image']
        
        # Fix 2: Proper file handling
        img_temp = NamedTemporaryFile(delete=True)
        for chunk in image_file.chunks():
            img_temp.write(chunk) 
        img_temp.flush()
        
        player.profile_image.save(
            f"{player.username}.jpg",
            File(img_temp), 
            save=True
        )

        return Response({
            'message': 'Profile image uploaded successfully',
            'image_url': player.profile_image.url
        })
        
    except Player.DoesNotExist:
        return Response({'error': 'Player not found'}, status=404)
    except Exception as e:
        return Response({'error': 'Error uploading image'}, status=HTTP_400_BAD_REQUEST)




class SearchUser(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        query = request.GET.get('q', '')

        if query:
            players = Player.objects.exclude(username='admin').filter(username__icontains=query)
        else:
            players = Player.objects.none()

        players_list = [
            {
                'id': player.id,
                'username': player.username,
                'profile_image': request.build_absolute_uri(player.profile_image.url) if player.profile_image else None,
                'level': player.level,
            }
            for player in players
        ]

        return Response(players_list, status=status.HTTP_200_OK)


class update_game_status(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def post(self,request):

        try:
            player = request.user

            player_earn = request.data.get('points', 0)
            player.points += player_earn

            player.level = math.floor(player.points / 1000) + 1

            player.save()
        except Exception as e:
            logger.error(f"Error during update: {e}")
        return Response({'message: ','score updated'}, status=status.HTTP_200_OK)
