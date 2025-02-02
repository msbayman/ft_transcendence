from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import Message
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from user_auth.models import Player
from .serializers import PlayerSerializer
from .serializers import ConversationSerializer
from rest_framework.views import APIView
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404

User = get_user_model()

class user_list_view(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        player = Player.objects.get(username=request.user.username)
        
        friends = player.list_users_friends.all()


        serializer = PlayerSerializer(friends, many=True, context={'request': request})
        return Response(serializer.data, status=200)

class LastMessageView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            logged_in_user = request.user

            messages = Message.objects.filter(
                Q(sender=logged_in_user) | Q(receiver=logged_in_user)
            ).order_by('-timestamp')


            last_messages = {}
            for message in messages:
                other_user = message.sender if message.sender != logged_in_user else message.receiver
                if other_user.id not in last_messages:
                    last_messages[other_user.id] = {
                        "user1": PlayerSerializer(logged_in_user, context={'request': request}).data,
                        "user2": PlayerSerializer(other_user, context={'request': request}).data,
                        "last_message": ConversationSerializer(message).data
                    }

            last_messages_list = list(last_messages.values())
            return Response(last_messages_list, status=200)
        except Exception as e:
            return Response({"error": "An unexpected error occurred."}, status=400)


class GetUserInfo(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        try:
            user = Player.objects.get(username=username)
            serializer = PlayerSerializer(user, context={'request': request})
            return Response(serializer.data, status=200)
        except Player.DoesNotExist:
            return Response({"error": "Player not found"}, status=404)
        except Exception as e:
            return Response({"error": "An error occurred: " + str(e)}, status=400)


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
                return Response(serialized_message)
            else:
                return Response(serialized_message, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=400)
        
class BlockUser(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request, username):
        other_user = get_object_or_404(Player, username=username)
        user = request.user
        try:
            user.block_user(other_user) 
            return Response({"message": f"Successfully blocked user {username}"})
        except Exception as e:
            return Response({"error": str(e)}, status=400)



class IsBlocked(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        other_user = get_object_or_404(Player, username=username)
        user = request.user
        try:
            status = user.is_blocked(other_user)
            return Response({"is_blocked": status})
        except AttributeError:
            return Response({"error": "Invalid user instance"}, status=400)

    
class UnBlockUser(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request, username):
        other_user = get_object_or_404(Player, username=username)
        user = request.user
        try:
            user.unblock_user(other_user) 
            return Response({"message": f"Successfully unblock_user user {username}"})
        except Exception as e:
            return Response({"error": str(e)}, status=400)