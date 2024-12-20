# views.py
from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from .models import Message
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import logging
from user_auth.models import Player
from .serializers import PlayerSerializer
from django.db.models import Q
from .serializers import MessageSerializer
from .serializers import ConversationSerializer
from rest_framework.views import APIView
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
logger = logging.getLogger(__name__)
User = get_user_model()

@login_required
def chat_view(request, username):

    other_user = User.objects.get(username=username)
    messages = Message.objects.filter(
        (Q(sender=request.user, receiver=other_user) | 
         Q(sender=other_user, receiver=request.user))
    ).order_by('timestamp')
    
    context = {
        'messages': messages,
        'other_user': other_user
    }
    return render(request, 'chat/chat.html', context)

@api_view(['GET'])
def user_list_view(request):
    players = Player.objects.all()  # Fetch all users from the Player model
    serializer = PlayerSerializer(players, many=True)
    return Response(serializer.data)

logger = logging.getLogger(__name__)

class LastMessageView(APIView):  # Remove LoginRequiredMixin
    """
    Last msg between two users 
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            logged_in_user = request.user
            # Add debug logging
            logger.debug(f"Logged in user ID: {logged_in_user.id}")
            
            all_users = Player.objects.exclude(id=logged_in_user.id)
            logger.debug(f"Found {all_users.count()} other users")
            
            last_messages = []

            for user in all_users:
                last_message = Message.objects.filter(
                    Q(sender=user, receiver=logged_in_user) | 
                    Q(sender=logged_in_user, receiver=user)
                ).order_by('-timestamp').first()

                if last_message:
                    serialized_message = MessageSerializer(last_message).data
                    last_messages.append({
                        "user1": logged_in_user.username,
                        "user2": user.username,
                        "last_message": serialized_message
                    })
                    logger.debug(f"Added message between {logged_in_user.username} and {user.username}")

            if last_messages:
                logger.debug(f"Returning {len(last_messages)} messages")
                return Response(last_messages)
            else:
                logger.debug("No messages found")
                return Response({"message": "No messages found with other users"}, status=404)

        except Exception as e:
            logger.error(f"Error in LastMessageView: {e}")
            return Response({"error": str(e)}, status=500)

class TestAuthView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "message": "Authentication successful",
            "user_id": request.user.id,
            "username": request.user.username
        })


class GetConversation(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            receiver = request.user
            # Add logging to check the header value
            username = request.headers.get('Username')
            logger.debug(f"Attempting to fetch conversation with username: {username}")
            
            if not username:
                return Response({"error": "Username header is required"}, status=400)
                
            sender = Player.objects.get(username=username)
            
            # Log the users involved
            logger.debug(f"Fetching conversation between {receiver.username} and {sender.username}")
            
            conversation = Message.objects.filter(
                ((models.Q(sender=sender) & models.Q(receiver=receiver)) |
                 (models.Q(sender=receiver) & models.Q(receiver=sender)))
            ).order_by('-timestamp')

            conversation_data = ConversationSerializer(conversation, many=True).data
            
            response_data = {
                "conversation": conversation_data,
                "meta": {
                    "message_count": len(conversation_data),
                    "users": {
                        "sender": sender.username,
                        "receiver": receiver.username
                    }
                }
            }
            
            return Response(response_data)
                
        except Player.DoesNotExist:
            logger.error(f"Player not found for username: {request.headers.get('Username')}")
            return Response({"error": "User not found"}, status=404)
        except Exception as e:
            logger.error(f"Unexpected error in GetConversation: {str(e)}")
            logger.error(f"Request headers: {request.headers}")
            return Response(
                {"error": "An unexpected error occurred", "detail": str(e)}, 
                status=500
            )