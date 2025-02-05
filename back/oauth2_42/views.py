from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.http import HttpRequest, HttpResponse, JsonResponse
import requests
from user_auth.models import Player
from user_auth.serializers import PlayerSerializer
from django.conf import settings
from user_auth.otp_view import generate_otp, send_otp_via_email
from django.utils import timezone
from rest_framework.request import Request as DRFRequest
from django.core.files.base import ContentFile
from django.shortcuts import redirect
from urllib.parse import urlencode
from rest_framework_simplejwt.tokens import RefreshToken


@api_view(['GET'])
@permission_classes([AllowAny])
def login(request: HttpRequest) -> HttpResponse:
    authorization_url = (
        f"{settings.OAUTH_42_AUTHORIZATION_URL}?client_id={settings.OAUTH_42_CLIENT_ID}&"
        f"redirect_uri={settings.OAUTH_42_REDIRECT_URI}&response_type=code&scope=public"
    )
    return redirect(authorization_url)

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
    
    try:
        response = requests.post(settings.OAUTH_42_TOKEN_URL, data=data, headers=headers)
        response.raise_for_status()  
        credentials = response.json()
        
        access_token = credentials.get('access_token')
        if access_token:
            headers = {
                'Authorization': f'Bearer {access_token}'
            }
            user_response = requests.get(settings.OAUTH_42_USER_INFO_URL, headers=headers)
            user_response.raise_for_status()  
            return user_response.json()
        else:
            return {"error": "Failed to obtain access token"}
            
    except requests.exceptions.RequestException as e:
        return {"error": f"Failed to exchange code: {str(e)}"}

@api_view(['GET'])
@permission_classes([AllowAny])
def login_redirect(request: DRFRequest):
    code = request.GET.get('code')
    if code:
        user_info = exchange_code_for_token_42(code)
        if "error" in user_info:
            return redirect(f"{settings.HOST_URL}/login?oauth_err=Failed to retrieve user info: {user_info['error']}")
        
        django_request = request._request
        return handle_oauth_user_42(django_request, user_info)
    else:
        return redirect(f"{settings.HOST_URL}/login?oauth_err=No code provided")

@api_view(['GET'])
@permission_classes([AllowAny])
def handle_oauth_user_42(request: HttpRequest, user_info: dict) -> HttpResponse:
    picture_url = user_info.get('image', {}).get('link')
    email = user_info.get('email').lower()
    username = user_info.get('login').lower()
    full_name = user_info.get('usual_full_name', username).lower()
    user_id_prov = user_info.get('id')

    if not all([email, username, full_name, user_id_prov]):
        login_url = f"cfrontend/login?oauth_err=Failed to retrieve user data"
        return redirect(login_url)

    if Player.objects.filter(email__iexact=email).exclude(prov_name="42").exists():
        login_url = f"{settings.HOST_URL}/login?oauth_err=email already exists"
        return redirect(login_url)

    try:
        user = Player.objects.get(email=email)
        user.prov_name = "42"
        user.save()
    except Player.DoesNotExist:
        base_username = username
        counter = 1
        while Player.objects.filter(username=username).exists():
            username = f"{base_username}_{counter}"
            counter += 1

        serializer = PlayerSerializer(data={
            'full_name': full_name,
            'email': email,
            'username': username,
            'id_prov': user_id_prov,
            'prov_name': "42",
        })

        if serializer.is_valid():
            user = serializer.save()
            user.set_unusable_password()

            if picture_url:
                response = requests.get(picture_url)
                if response.status_code == 200:
                    image_name = picture_url.split("/")[-1]
                    user.profile_image.save(image_name, ContentFile(response.content), save=True)

            user.save()
        else:
            error_message = "Failed to create or update user"
            error_details = urlencode({"details": str(serializer.errors)})
            redirect_url = f"{settings.HOST_URL}/login?oauth_err={error_message}&{error_details}"
            return redirect(redirect_url)

 
    if user.active_2fa:
        otp_code = generate_otp()
        send_otp_via_email(user.email, otp_code)

        user.otp_code = otp_code
        user.created_at = timezone.now()
        user.is_validate = True
        user.save()

        frontend_url = f"{settings.HOST_URL}/Valid_otp"
        redirect_url = f"{frontend_url}?username={user.username}"

        return redirect(redirect_url)
    else:
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        frontend_url = f"{settings.HOST_URL}/Overview"
        redirect_url = f"{frontend_url}?access_token={access_token}&refresh_token={refresh_token}"

        return redirect(redirect_url)