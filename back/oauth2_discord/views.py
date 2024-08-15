from django.shortcuts import redirect
from django.http import HttpRequest, HttpResponse, JsonResponse
import requests
from user_auth.models import Player
from user_auth.serializers import PlayerSerializer
from rest_framework_simplejwt.tokens import RefreshToken
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
        return add_player_oauth(request, user_info)
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

def add_player_oauth(request: HttpRequest, user_info: dict) -> JsonResponse:
    serializer = PlayerSerializer(data={
        'full_name': user_info.get('global_name', user_info.get('username')),
        'email': user_info.get('email'),
        'username': user_info.get('username'),
        'id_prov': user_info.get('id'),
        'prov_name': "Discord",
    })
    if serializer.is_valid():
        player = serializer.save()
        auth_login(request, player)
        refresh = RefreshToken.for_user(player)
        return JsonResponse({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'username': player.username,
        }, status=200)  # Changed to 200 as it could be either creation or update
    else:
        return JsonResponse(serializer.errors, status=400)