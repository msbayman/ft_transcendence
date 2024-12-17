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
from user_auth.models import Player  # Import the Player model
from .serializers import PlayerSerializer
# logger = logging.getLogger(__name__)


# @login_required
# @csrf_exempt
# def user_list_api(request):
#     users = User.objects.exclude(id=request.user.id)
#     users_data = [{'id': user.id, 'username': user.username} for user in users]
#     return JsonResponse(users_data, safe=False)

# Get the current user model dynamically
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

# @login_required
# def user_list_view(request):
#     users = User.objects.exclude(id=request.user.id)
#     return render(request, 'chat/user_list.html', {'users': users})



@api_view(['GET'])
def user_list_view(request):
    players = Player.objects.all()  # Fetch all users from the Player model
    serializer = PlayerSerializer(players, many=True)
    return Response(serializer.data)



# @api_view(['GET'])
# @permission_classes([IsAuthenticated])  # Ensures the user is logged in
# logger = logging.getLogger(__name__)
# @api_view(['GET'])
# def user_list_view(request):
#     logger.debug("Request data: %s", request.query_params)  # Use query_params for GET requests
#     users = User.objects.all()
#     logger.debug("Users queryset: %s", users)
#     serializer = UserSerializer(users, many=True)
#     return Response(serializer.data)
# @permission_classes([IsAuthenticated])  # Ensures the user is logged in
# def user_list_view(request):
#     users = User.objects.exclude(id=request.user.id)
#     serializer = UserSerializer(users, many=True)
#     return Response(serializer.data)