from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse, JsonResponse
import requests
from django.conf import settings
from user_auth.models import Player
from user_auth.serializers import PlayerSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import login as auth_login

# Discord OAuth2 URL
url_red = "https://discord.com/oauth2/authorize?client_id=1272193976983752706&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A8000%2Fdiscord%2Flogin_redirect&scope=email+identify"

def home(request: HttpRequest) -> JsonResponse:
    return JsonResponse({"msg": "slm"})

def login(request: HttpRequest) -> HttpResponse:
    return redirect(url_red)

def login_redirect(request: HttpRequest) -> JsonResponse:
    code = request.GET.get('code')

    if code:
        user_info = exchange_code_for_token(code)

        # Handle adding the player to the database
        return add_player_oauth(user_info)
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

    # Fetch user information using the access token
    access_token = credentials.get('access_token')
    if access_token:
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        user_response = requests.get('https://discord.com/api/v6/users/@me', headers=headers)
        user = user_response.json()
        return user  # Return user info
    else:
        return {"error": "Failed to obtain access token"}

def add_player_oauth(user_info: dict) -> JsonResponse:
    # Extract relevant information from user_info
    username = user_info.get('username')
    email = user_info.get('email')
    discord_id = user_info.get('id')
    full_name = user_info.get('global_name', username)  # Fallback to username if global_name is not provided

    # Check if a user with the same id_prov (Discord ID) already exists
    try:
        player = Player.objects.get(id_prov=discord_id, prov_name="Discord")
        # If found, log the user in and return JWT tokens
        refresh = RefreshToken.for_user(player)
        return JsonResponse({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'username': player.username,
        }, status=200)
    except ObjectDoesNotExist:
        # Handle username collision by appending numbers until a unique username is found
        base_username = username
        counter = 1
        while Player.objects.filter(username=username).exists():
            username = f"{base_username}_{counter}"
            counter += 1
        
        # Create a new Player object
        player = Player(
            full_name=full_name,
            email=email,
            username=username,
            id_prov=discord_id,
            prov_name="Discord",
        )
        player.set_unusable_password()  # Since this is an OAuth user, no password is needed
        player.save()

        # Log the user in and return JWT tokens
        auth_login(request, player)  # Log the user in to create a session (optional)
        refresh = RefreshToken.for_user(player)
        return JsonResponse({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'username': player.username,
        }, status=201)
