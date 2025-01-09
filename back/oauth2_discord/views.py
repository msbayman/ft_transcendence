from django.shortcuts import redirect
from django.http import HttpRequest, HttpResponse, JsonResponse
import requests
from user_auth.models import Player
from django.conf import settings
from user_auth.serializers import PlayerSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth import login as auth_login
from user_auth.otp_view import generate_otp , send_otp_via_email
from django.utils import timezone
from rest_framework.request import Request as DRFRequest

# Discord OAuth2 URL
@api_view(['GET'])
@permission_classes([AllowAny])
def login(request: HttpRequest) -> HttpResponse:
    return redirect(settings.DISCORD_OAUTH_URL)


@api_view(['GET'])
@permission_classes([AllowAny])
def login_redirect(request: DRFRequest) -> JsonResponse:
    code = request.GET.get('code')
    if code:
        user_info = exchange_code_for_token(code)
        if "error" in user_info:
            return JsonResponse({"error": "Failed to retrieve user info"}, status=400)
        
        # Extract the Django HttpRequest object
        django_request = request._request
        return handle_oauth_user(django_request, user_info)
    else:
        return JsonResponse({"error": "No code provided"}, status=400)

def exchange_code_for_token(code: str) -> dict:
    data = {
        'client_id': settings.OAUTH_DISCORD_CLIENT_ID,
        'client_secret': settings.OAUTH_DISCORD_CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': settings.OAUTH_DISCORD_REDIRECT_URI,
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    response = requests.post(settings.OAUTH_DISCORD_TOKEN_URL, data=data, headers=headers)
    credentials = response.json()

    access_token = credentials.get('access_token')
    if access_token:
        headers = {
            'Authorization': f'Bearer {access_token}'
        }
        user_response = requests.get(settings.DSCORD_API_V6, headers=headers)
        return user_response.json()
    else:
        return {"error": "Failed to obtain access token"}

@api_view(['GET'])
@permission_classes([AllowAny])
def handle_oauth_user(request: HttpRequest, user_info: dict) -> HttpResponse:
    email        = user_info.get('email')
    username     = user_info.get('username')
    full_name    = user_info.get('global_name', username)
    user_id_prov = user_info.get('id')

    if not(all([email, username, full_name, user_id_prov])):
        login_url = f"http://localhost:5173/login?error=Failed to retrieve user data"
        return redirect(login_url)
    if Player.objects.filter(email__iexact=email).exclude(prov_name="Discord").exists():
        login_url = f"http://localhost:5173/login?error=email already exists"
        return redirect(login_url)
    try:
        user = Player.objects.get(email = email)
        user.prov_name = "Discord"
        user.save()
    except Player.DoesNotExist:
        base_username = username
        counter = 1
        while Player.objects.filter(username = username).exists():
            username = f"{base_username}_{counter}"
            counter += 1
        data = {
            'full_name' : full_name,
            'email'     : email,
            'username'  : username,
            'id_prov'   : user_id_prov,
            'prov_name' : "Discord",
        }
        serializer = PlayerSerializer(data = data)
        print ("data:", data)
        if serializer.is_valid(): 
            user = serializer.save()
            user.set_unusable_password()
            user.save()
        else:
            
            return JsonResponse({"error": "Failed to create or update user..salam", "details": serializer.errors}, status=500)

    # Check if 2FA is enabled
    if user.active_2fa:
        # Generate and send OTP
        otp_code = generate_otp()
        print(otp_code)
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
        

        return redirect(redirect_url)
