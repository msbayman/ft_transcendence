from django.shortcuts import redirect
from django.http import HttpRequest, HttpResponse, JsonResponse
import requests
from user_auth.models import Player
from user_auth.serializers import PlayerSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings 

# 42 OAuth2 URL
def login(request: HttpRequest) -> HttpResponse:
    authorization_url = (
        f"{settings.OAUTH_42_AUTHORIZATION_URL}?client_id={settings.OAUTH_42_CLIENT_ID}&"
        f"redirect_uri={settings.OAUTH_42_REDIRECT_URI}&response_type=code&scope=public"
    )
    return redirect(authorization_url)

def login_redirect(request: HttpRequest) -> JsonResponse:
    code = request.GET.get('code')
    if code:
        user_info = exchange_code_for_token_42(code)
        if "error" in user_info:
            return JsonResponse({"error": "Failed to retrieve user info"}, status=400)
        return handle_oauth_user_42(request, user_info)
    else:
        return JsonResponse({"error": "No code provided"}, status=400)

def exchange_code_for_token_42(code: str) -> dict:
    data = {
        'grant_type': 'authorization_code',
        'client_id': settings.OAUTH_42_CLIENT_ID,
        'client_secret': settings.OAUTH_42_CLIENT_SECRET,
        'code': code,
        'redirect_uri': settings.OAUTH_42_REDIRECT_URI,
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    response = requests.post(settings.OAUTH_42_TOKEN_URL, data=data, headers=headers)
    credentials = response.json()

    access_token = credentials.get('access_token')
    if access_token:
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        user_response = requests.get(settings.OAUTH_42_USER_INFO_URL, headers=headers)
        return user_response.json()
    else:
        return {"error": "Failed to obtain access token"}

def handle_oauth_user_42(request: HttpRequest, user_info: dict) -> HttpResponse:
    email = user_info.get('email')
    username = user_info.get('login')
    user_id_prov = user_info.get('id')

    try:
        user = Player.objects.get(email=email)
        user.id_prov = user_id_prov
        user.prov_name = "42"
        user.save()
    except Player.DoesNotExist:
        base_username = username
        counter = 1
        while Player.objects.filter(username=username).exists():
            username = f"{base_username}_{counter}"
            counter += 1

        serializer = PlayerSerializer(data={
            'full_name': user_info.get('displayname', username),
            'email': email,
            'username': username,
            'id_prov': user_id_prov,
            'prov_name': "42",
        })
        if serializer.is_valid():
            user = serializer.save()
            user.set_unusable_password()
            user.save()
        else:
            return JsonResponse({"error": "Failed to create or update user"}, status=500)

    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    # Debugging: Print tokens and redirect URL
    print(f"User ID: {user.id}")
    print(f"Access Token: {access_token}")
    print(f"Refresh Token: {refresh_token}")

    frontend_url = "http://localhost:5173/My_profile"
    redirect_url = f"{frontend_url}?access_token={access_token}&refresh_token={refresh_token}"
    
    print(f"Redirect URL: {redirect_url}")

    return redirect(redirect_url)
