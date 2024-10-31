from django.shortcuts import redirect
from django.http import HttpRequest, HttpResponse, JsonResponse
import requests
from user_auth.models import Player
from user_auth.serializers import PlayerSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import login as auth_login
from user_auth.otp_view import generate_otp , send_otp_via_email
from django.utils import timezone

# Discord OAuth2 URL
DISCORD_OAUTH_URL = "https://discord.com/oauth2/authorize?client_id=1272193976983752706&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A8000%2Fdiscord%2Flogin_redirect&scope=email+identify"
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
        'client_secret': "gDEzOmoJ_gNmEBP4IPAfN9v_S3oQn_tK",
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

# def handle_oauth_user(request: HttpRequest, user_info: dict) -> HttpResponse:
#     email = user_info.get('email')
#     username = user_info.get('username')
#     user_id_prov = user_info.get('id')
    
#     try:
#         user = Player.objects.get(email=email)
#         user.id_prov = user_id_prov
#         user.prov_name = "Discord"
#         user.save()
#     except Player.DoesNotExist:
#         base_username = username
#         counter = 1
#         while Player.objects.filter(username=username).exists():
#             username = f"{base_username}_{counter}"
#             counter += 1

#         serializer = PlayerSerializer(data={
#             'full_name': user_info.get('global_name', username),
#             'email': email,
#             'username': username,
#             'id_prov': user_id_prov,
#             'prov_name': "Discord",
#         })
#         if serializer.is_valid():
#             user = serializer.save()
#             user.set_unusable_password()
#             user.save()
#         else:
#             print(serializer.error_messages)
#             return JsonResponse({"error": "Failed to create or update user"}, status=500)

#     refresh = RefreshToken.for_user(user)
#     access_token = str(refresh.access_token)
#     refresh_token = str(refresh)


#     frontend_url = "http://localhost:5173/Overview"
#     redirect_url = f"{frontend_url}?access_token={access_token}&refresh_token={refresh_token}"
    
#     print(f"Redirect URL: {redirect_url}")

#     return redirect(redirect_url)




def handle_oauth_user(request: HttpRequest, user_info: dict) -> HttpResponse:
    email = user_info.get('email')
    username = user_info.get('username')
    user_id_prov = user_info.get('id')
    
    try:
        user = Player.objects.get(email=email)
        user.id_prov = user_id_prov
        user.prov_name = "Discord"
        user.save()
    except Player.DoesNotExist:
        base_username = username
        counter = 1
        while Player.objects.filter(username=username).exists():
            username = f"{base_username}_{counter}"
            counter += 1

        serializer = PlayerSerializer(data={
            'full_name': user_info.get('global_name', username),
            'email': email,
            'username': username,
            'id_prov': user_id_prov,
            'prov_name': "Discord",
        })
        if serializer.is_valid(): 
            user = serializer.save()
            user.set_unusable_password()
            user.save()
        else:
            return JsonResponse({"error": "Failed to create or update user"}, status=500)

    # Check if 2FA is enabled
    if user.active_2fa:
        # Generate and send OTP
        otp_code = generate_otp()
        send_otp_via_email(user.email, otp_code)
        
        # Store OTP in the player's record
        user.otp_code = otp_code
        user.created_at = timezone.now()
        user.save()

        # Redirect to the OTP verification page
        frontend_url = "http://localhost:5173/Valid_otp"
        redirect_url = f"{frontend_url}?username={user.username}"

        return redirect(redirect_url)
    else:
        # If 2FA is disabled, proceed to login and generate tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        frontend_url = "http://localhost:5173/Overview"
        redirect_url = f"{frontend_url}?access_token={access_token}&refresh_token={refresh_token}"
        
        print(f"Redirect URL: {redirect_url}")

        return redirect(redirect_url)
