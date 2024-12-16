# views.py
from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from .models import Message
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

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

@login_required
def user_list_view(request):
    users = User.objects.exclude(id=request.user.id)
    return render(request, 'chat/user_list.html', {'users': users})