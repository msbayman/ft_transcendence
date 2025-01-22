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
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404
# logger = logging.getLogger(__name__)
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
        player = Player.objects.get(username=request.user.username)  # Get the logged-in player
        
        # Access the list_users_friends field on the player instance
        friends = player.list_users_friends.all()

        # Serialize the friends list
        serializer = PlayerSerializer(friends, many=True, context={'request': request}) # Serialize all friends
        return Response(serializer.data, status=200)

class LastMessageView(APIView):
    """
    Returns an array of the last message between the logged-in user and all other users.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

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
                        "user1": PlayerSerializer(logged_in_user, context={'request': request}).data,
                        "user2": PlayerSerializer(other_user, context={'request': request}).data,
                        "last_message": ConversationSerializer(message).data
                    }

            # Convert the grouped messages into an array
            last_messages_list = list(last_messages.values())

            if last_messages_list:
                logger.debug(f"Returning {len(last_messages_list)} messages")
                return Response(last_messages_list, status=200)
            else:
                logger.debug("No messages found")
                return Response({"message": "No messages found with other users"}, status=200)

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
        
class GetUserInfo(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        try:
            user = Player.objects.get(username=username)
            serializer = PlayerSerializer(user, context={'request': request}) # Serialize all friends
            # serializer = PlayerSerializer(user)
            return Response(serializer.data, status=200)
        except Player.DoesNotExist:
            return Response({"error": "Player not found"}, status=404)
        except Exception as e:
            return Response({"error": "An error occurred: " + str(e)}, status=500)


class GetConversation(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        try:
            receiver = request.user
            sender_username = username

            if not sender_username:
                return Response({"error": "Username header is required"}, status=400)

            try:
                sender = Player.objects.get(username=sender_username)
            except Player.DoesNotExist:
                return Response({"error": "Sender not found"}, status=404)


            conversation = Message.objects.filter(
                (Q(sender=sender, receiver=receiver) | Q(sender=receiver, receiver=sender))
            ).order_by('-timestamp')

            serialized_message = ConversationSerializer(conversation, many=True).data

            if serialized_message:
                logger.debug(f"Returning {len(serialized_message)} messages")
                return Response(serialized_message)
            else:
                logger.debug("No messages found")
                return Response({"message": "No messages found with other users"}, status=404)

        except Exception as e:
            logger.error(f"Error in conversation: {e}")
            return Response({"error": str(e)}, status=500)
        
class BlockUser(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request, username):
        try:
            other_user = get_object_or_404(Player, username=username)
            user = request.user
            user.block_user(other_user) 
            return Response({"message": f"Successfully blocked user {username}"})
            
        except ObjectDoesNotExist:
            return Response({"error": "User not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class IsBlocked(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        other_user = get_object_or_404(Player, username=username)
        user = request.user

        status = user.is_blocked(other_user)
        

        return Response({"is_blocked": status})
    
class UnBlockUser(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request, username):
        try:
            other_user = get_object_or_404(Player, username=username)
            user = request.user
            user.unblock_user(other_user) 
            return Response({"message": f"Successfully unblock_user user {username}"})
            
        except ObjectDoesNotExist:
            return Response({"error": "User not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)