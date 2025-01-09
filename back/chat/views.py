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

# @api_view(['GET'])
class user_list_view(APIView):
    authentication_classes = [JWTAuthentication]
    def get(self, request):
        players = Player.objects.all().exclude(username=request.user.username)  # Fetch all users from the Player model
        serializer = PlayerSerializer(players, many=True)
        return Response(serializer.data, status=200)

logger = logging.getLogger(__name__)

class LastMessageView(APIView):
    """
    Returns an array of the last message between the logged-in user and all other users.
    """
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        try:
            logged_in_user = request.user
            logger.debug(f"Logged-in user ID: {logged_in_user.id}")

            # Fetch all relevant messages involving the logged-in user
            messages = Message.objects.filter(
                Q(sender=logged_in_user) | Q(receiver=logged_in_user)
            ).order_by('-timestamp')

            # Group messages by the other user
            last_messages = {}
            for message in messages:
                other_user = message.sender if message.sender != logged_in_user else message.receiver
                if other_user.id not in last_messages:
                    # Add the latest message to the dictionary
                    last_messages[other_user.id] = {
                        "user1": logged_in_user.username,
                        "user2": other_user.username,
                        "last_message": MessageSerializer(message).data
                    }

            # Convert the grouped messages into an array
            last_messages_list = list(last_messages.values())

            if last_messages_list:
                logger.debug(f"Returning {len(last_messages_list)} messages")
                return Response(last_messages_list, status=200)
            else:
                logger.debug("No messages found")
                return Response({"message": "No messages found with other users"}, status=404)

        except Exception as e:
            logger.error(f"Error in LastMessageView: {str(e)}")
            return Response({"error": "An unexpected error occurred."}, status=500)


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

    def get(self, request, username):
        try:
            receiver = request.user
            sender_username = username
            

            # If the username header is not provided, return an error
            if not sender_username:
                return Response({"error": "Username header is required"}, status=400)

            # Get the sender object using the username from the header
            try:
                sender = Player.objects.get(username=sender_username)
            except Player.DoesNotExist:
                return Response({"error": "Sender not found"}, status=404)

            # Fetch all messages where the sender is either the logged-in user or the user provided in the header
            conversation = Message.objects.filter(
                (Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender))
            ).order_by('-timestamp')

            # Serialize the messages
            serialized_message = MessageSerializer(conversation, many=True).data

            # Return the serialized messages or a message if no messages were found
            if serialized_message:
                logger.debug(f"Returning {len(serialized_message)} messages")
                return Response(serialized_message)
            else:
                logger.debug("No messages found")
                return Response({"message": "No messages found with other users"}, status=404)

        except Exception as e:
            logger.error(f"Error in conversation: {e}")
            return Response({"error": str(e)}, status=500)
