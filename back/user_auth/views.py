# from django.http import JsonResponse
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.response import Response
# from rest_framework import status
# from .models import Player
# from .serializers import PlayerSerializer
# from django.contrib.auth import authenticate
# from rest_framework.views import APIView
# from rest_framework.permissions import IsAuthenticated
# from rest_framework_simplejwt.tokens import RefreshToken
# import logging

# # Logger setup
# logger = logging.getLogger(__name__)

# @api_view(['GET'])
# def index(request):
#     return Response("Hello, world")

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def display_users(request):
#     players = Player.objects.all()
#     serializer = PlayerSerializer(players, many=True)
#     return Response(serializer.data)

# @api_view(['POST'])
# def delete_player(request):
#     username = request.data.get('username')
#     if not username:
#         return Response({'error': 'Username is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
#     try:
#         player_to_delete = Player.objects.get(username=username)
#         player_to_delete.delete()
#         return Response({'message': f'Player {username} deleted successfully'}, status=status.HTTP_200_OK)
#     except Player.DoesNotExist:
#         return Response({'error': 'Player not found'}, status=status.HTTP_404_NOT_FOUND)
#     except Exception as e:
#         logger.error(f"Error deleting player {username}: {e}")
#         return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# @api_view(['POST'])
# def update_player(request):
#     username = request.data.get('username')
#     if not username:
#         return Response({'error': 'Username is required.'}, status=status.HTTP_400_BAD_REQUEST)

#     try:
#         player_to_update = Player.objects.get(username=username)
#         serializer = PlayerSerializer(player_to_update, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#     except Player.DoesNotExist:
#         return Response({'error': 'Player not found'}, status=status.HTTP_404_NOT_FOUND)
#     except Exception as e:
#         logger.error(f"Error updating player {username}: {e}")
#         return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# @api_view(['POST'])
# def add_player(request):
#     serializer = PlayerSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class LoginAPIView(APIView):
#     def post(self, request):
#         username = request.data.get('username')
#         password = request.data.get('password')
        
#         if not username or not password:
#             return Response({"detail": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

#         user = authenticate(request=request, username=username, password=password)
        
#         if user is not None:
#             refresh = RefreshToken.for_user(user)
#             return Response({
#                 'refresh': str(refresh),
#                 'access': str(refresh.access_token),
#             }, status=status.HTTP_200_OK)
#         else:
#             return Response({"detail": "Invalid username or password."}, status=status.HTTP_401_UNAUTHORIZED)

# class UserDetailView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         data = {
#             'id': user.id,
#             'username': user.username,
#             'email': user.email,
#             'full_name': user.full_name,
#         }
#         return Response(data)




import logging
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes  # Correct import for api_view and permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .otp_view import generate_otp, send_otp_via_email  # No need for store_otp and verify_otp imports
from .models import Player
from django.utils import timezone
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
        otp = request.data.get('otp')

        if not username or not password:
            return Response({"detail": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request=request, username=username, password=password)

        if user is not None:
            player = Player.objects.get(username=username)
            
            # If OTP is provided, verify it
            if otp:
                if player.is_expired():
                    return Response({"detail": "OTP has expired."}, status=status.HTTP_400_BAD_REQUEST)
                
                if player.otp_code == otp:
                    print("======================================================================",otp)
                    # OTP is correct, proceed to login and generate tokens
                    refresh = RefreshToken.for_user(user)
                    return Response({
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({"detail": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)
            
            # If no OTP is provided, send it
            else:
                otp_code = generate_otp()
                send_otp_via_email(user.email, otp_code)  # Send OTP via email
                
                # Store OTP in the player's record
                player.otp_code = otp_code
                player.created_at = timezone.now()
                player.save()
                
                return Response({"detail": "OTP sent to your email. Please verify to continue."}, status=status.HTTP_200_OK)
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
