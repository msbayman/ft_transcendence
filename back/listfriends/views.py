from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from user_auth.models import Player
from .models import Friend_request
from django.db import models
from django.http import JsonResponse


class SendFriendRequest(APIView):
    permission_classes = [IsAuthenticated]

    # note: check if there already  exist / shouldnot create new one if exists ...
    def post(self, request, username):
        if not request.user.is_authenticated:
            return Response({"error": "User is not authenticated"}, status=status.HTTP_401_UNAUTHORIZED)
        sender = request.user 
        try:
            receiver = Player.objects.get(username=username)
        except Player.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if receiver == sender:
            return Response({"error": "User is You"}, status=status.HTTP_400_BAD_REQUEST)

        if Friend_request.objects.filter(my_user=sender, other_user=receiver, states='accepted').exists():
            return Response({"error": "Friend request already sent"}, status=status.HTTP_400_BAD_REQUEST)
        
        # denied = Friend_request.objects.filter(my_user=sender, other_user=receiver, states='denied').exists()
        # if denied:
        #     denied.states = 'pending'
        #     denied.save()
        #     return Response({"error": "Friend Denied request already sent"}, status=status.HTTP_200_OK)

        # Create a new friend request
        Friend_request.objects.create(my_user=sender, other_user=receiver, states='pending')
        return Response({"message": "Friend request sent successfully"}, status=status.HTTP_201_CREATED)


class AcceptFriendRequest(APIView):
    permission_classes = [IsAuthenticated] 
    def post(self, request, username):
        receiver = request.user  # The user accepting the request
        try:
            sender = Player.objects.get(username=username)  # The user who sent the request
        except Player.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Find the pending friend request
        try:
            friend_request = Friend_request.objects.get(my_user=sender, other_user=receiver, states='pending')
        except Friend_request.DoesNotExist:
            return Response({"error": "No pending friend request found"}, status=status.HTTP_404_NOT_FOUND)

        # Update the friend request status to 'accepted'
        # Note: accept only when its pending
        friend_request.states = 'accepted'
        friend_request.save()

        # Add each user to the other's friends list
        receiver.list_users_friends.add(sender)
        sender.list_users_friends.add(receiver)

        return Response({"message": "Friend request accepted successfully"}, status=status.HTTP_200_OK)
    

def list_all_friend_requests(request):
    # Fetch all Friend_request objects
    all_friend_requests = Friend_request.objects.all()

    # Serialize the data
    friend_requests_data = []
    for request in all_friend_requests:
        friend_requests_data.append({
            "id": request.id,
            "sender": request.my_user.username,
            "receiver": request.other_user.username,
            "status": request.states,
        })

    return JsonResponse(friend_requests_data, safe=False)

class DeclineFriendRequest(APIView):
    permission_classes = [IsAuthenticated] 
    def post(self, request, username):
        receiver = request.user  # The user accepting the request
        try:
            sender = Player.objects.get(username=username)  # The user who sent the request
        except Player.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Find the pending friend request
        try:
            friend_request = Friend_request.objects.filter( models.Q(my_user=sender, other_user=receiver, states='pending') | models.Q(my_user=receiver, other_user=sender, states='pending') ).first()
        except Friend_request.DoesNotExist:
            return Response({"error": "No pending friend request found"}, status=status.HTTP_404_NOT_FOUND)

        # Update the friend request status to 'accepted'
        friend_request.delete()

        return Response({"message": "Friend request denied successfully"}, status=status.HTTP_200_OK)


class CheckFriendRequest(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        user = request.user
        try:
            other_user = Player.objects.get(username=username)
        except Player.DoesNotExist:
            return Response({"states": "denied"}, status=status.HTTP_404_NOT_FOUND)

        # Retrieve the friend request object (if it exists)
        friend_request = Friend_request.objects.filter( models.Q(my_user=user, other_user=other_user) | models.Q(my_user=other_user, other_user=user) ).first()

        # If no friend request exists, return "denied"
        if not friend_request:
            return Response({"states": "denied"}, status=status.HTTP_200_OK)

        # Return the friend request details
        return Response({
            "my_user": friend_request.my_user.username,
            "other_user": friend_request.other_user.username,
            "states": friend_request.states,
        }, status=status.HTTP_200_OK)