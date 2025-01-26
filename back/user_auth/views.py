import logging
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
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
from django.utils.timezone import now
import requests
from django.http import JsonResponse
from django.core.management.base import BaseCommand
from django.utils import timezone
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.mail import send_mail
from django.conf import settings


# Logger setup
logger = logging.getLogger(__name__)

# @api_view(['GET'])
# @permission_classes([AllowAny])
# def health_check(request):
#     return JsonResponse({"status": "ok"})




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

        for friend in player_to_delete.list_users_friends.all():
            friend.list_users_friends.remove(player_to_delete)

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
    username = request.user.username
    new_username = request.data.get('username')
    
    if not new_username:
        return Response({'error': 'Username is required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Use the serializer's validation method to validate the new username
        serializer = PlayerSerializer()
        validated_username = serializer.validate_username(new_username)

        with transaction.atomic():
            if Player.objects.filter(username=validated_username).exists():
                return Response(
                    {'error': 'This username is already taken.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Fetch the player and update the username
            player_to_update = Player.objects.get(username=username)
            player_to_update.username = validated_username
            player_to_update.save()
            
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
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def changePassword(request):
    data = request.data
    new_password = data.get('newPassword')
    old_password = data.get('oldPassword')
    user = Player.objects.filter(userID=request.user.userID).first()
    if not user.check_password(old_password):
        return Response({'error': 'Invalid old password'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        password_validation.validate_password(new_password)
        if old_password == new_password:
            return JsonResponse({'error': 'New password cannot be the same as old password'}, status=status.HTTP_400_BAD_REQUEST)
    except ValidationError as e:
        return Response({'error': ' '.join(e.messages)}, status=status.HTTP_400_BAD_REQUEST)
    user.set_password(new_password)
    user.save()
    return Response({'success': True, 'message': 'Password changed successfully'}, status=status.HTTP_200_OK)


# @permission_classes([IsAuthenticated])
class enable_2fa(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def post(self, request):
        try:
            user = request.user
            user.active_2fa = True
            user.save()
            send_otp_via_email(user.email, generate_otp())
            return Response({'message': '2FA enabled successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'An error occurred while enabling 2FA'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def resend_otp(request):
    otp = generate_otp()
    recipient_email = request.user.email
    subject = 'Your One-Time Password (OTP)'
    body = f'Your OTP To activate 2FA is: {otp}\nThis OTP is valid for 5 minutes.'
    send_mail(
        subject=subject,
        message=body,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[recipient_email],
        fail_silently=False,
    )
    store_otp(recipient_email, otp)

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

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        users = request.user
        # users.is_online = True
        users.save();
        serializer = PlayerSerializer(users , context = {"request": request})
        return Response( serializer.data )


@api_view(['GET'])
@permission_classes([AllowAny])
def list_users(request):
    players = Player.objects.all()
    serializer = PlayerSerializer(players, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
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
            player = Player.objects.get(username=user.username)  # Get the Player instance
            player.is_online = False  # Set is_online to False
            player.save()  # Save the changes


            return Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Player.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error during logout: {e}")
            return Response({"detail": "An error occurred during logout."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class GetPlayer(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        try:
            data_player = Player.objects.get(username=username)
            serializer = PlayerSerializer(data_player)
            return Response(serializer.data)
        except Player.DoesNotExist:
            return Response({"error": "No player found with this username"}, status=status.HTTP_404_NOT_FOUND)
        

# class SearchUser(APIView):
#     def get(self, request):
#         query = request.GET.get('q', '')  # Get the search query from the request
#         print(f"------->>>>>Query: {query}")
#         if query:
#             # Filter players based on the query (e.g., search by full_name)
#             players = Player.objects.exclude(username='admin').filter(username__icontains=query)  # Case-insensitive search
#         else:
#             players = Player.objects.none()  # Return an empty queryset if no query

#         # Convert the queryset to a list of dictionaries with only full_name and profile_image
#         players_list = list(players.values('id', 'username', 'profile_image', 'level'))
#         print(players_list , '<><><><><><><><<<<<<>>>>????')

#         return Response(players_list, status=status.HTTP_200_OK)


class SearchUser(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        query = request.GET.get('q', '')

        # Validate minimum query length
        # min_length = 3
        # if len(query) < min_length:
        #     return Response(
        #         {"error": f"Query must be at least {min_length} characters long."},
        #         status=status.HTTP_400_BAD_REQUEST
        #     )

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

        # return Response(players_list, status=status.HTTP_200_OK)