from django.shortcuts import redirect
from django.http import HttpRequest, HttpResponse, JsonResponse
import requests
from user_auth.models import Player
from user_auth.serializers import PlayerSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import login as auth_login
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate

# Discord OAuth2 URL
DISCORD_OAUTH_URL = (
    "https://discord.com/oauth2/authorize?"
    "client_id=1272193976983752706&"
    "response_type=code&"
    "redirect_uri=http%3A%2F%2F127.0.0.1%3A8000%2Fdiscord%2Flogin_redirect&"
    "scope=email+identify"
)

def home(request: HttpRequest) -> JsonResponse:
    return JsonResponse({"msg": "slm"})

def login(request: HttpRequest) -> HttpResponse:
    return redirect(DISCORD_OAUTH_URL)

def login_redirect(request: HttpRequest) -> JsonResponse:
    code = request.GET.get('code')
    if code:
        user_info = exchange_code_for_token(code)
        if "error" in user_info:
            return JsonResponse({"error": "Failed to retrieve user info"}, status=400)
        return handle_oauth_user(request, user_info)
    else:
        return JsonResponse({"error": "No code provided"}, status=400)

def exchange_code_for_token(code: str) -> dict:
    data = {
        'client_id': "1272193976983752706",
        'client_secret': "A-avTEAQ-gzHms8y11YHTcICPjihhvn0",
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': 'http://127.0.0.1:8000/discord/login_redirect',
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    response = requests.post('https://discord.com/api/oauth2/token', data=data, headers=headers)
    credentials = response.json()

    access_token = credentials.get('access_token')
    if access_token:
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        user_response = requests.get('https://discord.com/api/v6/users/@me', headers=headers)
        return user_response.json()
    else:
        return {"error": "Failed to obtain access token"}

def handle_oauth_user(request: HttpRequest, user_info: dict) -> HttpResponse:
    email = user_info.get('email')
    username = user_info.get('username')

    # Attempt to find or create the user
    try:
        # Try to get the user by email (which should be unique)
        user = Player.objects.get(email=email)

        # Update the user's OAuth details
        user.id_prov = user_info.get('id')
        user.prov_name = "Discord"
        user.save()

    except Player.DoesNotExist:
        # If no user with the email exists, create a new user

        # Check if the username already exists and generate a unique one if necessary
        base_username = username
        counter = 1

        while Player.objects.filter(username=username).exists():
            username = f"{base_username}_{counter}"
            counter += 1

        # Create the new user
        serializer = PlayerSerializer(data={
            'full_name': user_info.get('global_name', username),
            'email': email,
            'username': username,
            'id_prov': user_info.get('id'),
            'prov_name': "Discord",
        })
        if serializer.is_valid():
            user = serializer.save()
            user.set_unusable_password()  # OAuth users don't use passwords
            user.save()
        else:
            # In case of an unexpected validation error, return a generic error
            return JsonResponse({"error": "Failed to create or update user"}, status=500)

    # Log the user in and generate JWT tokens
    auth_login(request, user)  # Create a session
    refresh = RefreshToken.for_user(user)  # Generate JWT tokens

    frontend_url = "http://localhost:5173/login"  # Adjust this URL to match your frontend
    redirect_url = f"{frontend_url}?oauth_success=true"
    return redirect(redirect_url)