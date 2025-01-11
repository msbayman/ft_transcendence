from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Player
from rest_framework.permissions import IsAuthenticated
from user_auth.models import Player
from .models import Friend_request
from django.contrib.auth.models import AnonymousUser
from rest_framework.permissions import AllowAny

# from rest_framework_simplejwt.authentication import JWTAuthentication

# Create your views here.




class send_to_friend(APIView):
    permission_classes = [AllowAny]

    def post(self, request, username):
        print('<><><><><><><><><><>')
        sender = request.user

        if isinstance(sender, AnonymousUser):
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            receiver = Player.objects.get(username=username)
        except Player.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Create a new friend request
        Friend_request.objects.create(my_user=sender, other_user=receiver, states='pending')

        return Response({"message": "Friend request sent successfully"}, status=status.HTTP_201_CREATED)


# class send_to_friend(APIView):

#     permission_classes = [AllowAny]

#     def post(self, request, username):
#         print('<><><><><><><><><><>')
#         sender = request.user
#         try:
#             receiver = Player.objects.get(username=username)

#         except Player.DoesNotExist:
#             return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

#         # if Friend_request.objects.filter(sender=sender, receiver=receiver).exists():
#         #     return Response({"error": "Friend request already sent"}, status=status.HTTP_400_BAD_REQUEST)

#         # Create a new friend request
#         # FriendRequest.objects.create(sender=sender, receiver=receiver, status='pending')

#         Friend_request.objects.create(my_user=sender, other_user=receiver, states='pending')

#         return Response({"message": "Friend request sent successfully"}, status=status.HTTP_201_CREATED)

class accept_tobe_friend(APIView):

    permission_classes = [AllowAny]

    def post(self, request, username):
        receiver = request.user

        try:
            sender = Player.objects.get(username=username)
        except Player.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        conversation = Friend_request.objects.get(receiver=receiver, sender=sender, status='pending')
        conversation.states='accpted'
        conversation.save()
        receiver.list_users_friends.add(sender)
        sender.list_users_friends.add(receiver)

        return Response({"message": "Friend request accept states successfully"}, status=status.HTTP_201_CREATED)
