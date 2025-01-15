from pathlib import Path
from datetime import timedelta
import os
from dotenv import load_dotenv 
# from django.contrib.auth.models import User  # Ensure no unexpected indentation here

load_dotenv()



# OAuth 42 Configuration
OAUTH_42_CLIENT_ID = os.getenv('OAUTH_42_CLIENT_ID')
OAUTH_42_CLIENT_SECRET = os.getenv('OAUTH_42_CLIENT_SECRET')
OAUTH_42_REDIRECT_URI = os.getenv('OAUTH_42_REDIRECT_URI')
OAUTH_42_AUTHORIZATION_URL = 'https://api.intra.42.fr/oauth/authorize'
OAUTH_42_TOKEN_URL = 'https://api.intra.42.fr/oauth/token'
OAUTH_42_USER_INFO_URL = 'https://api.intra.42.fr/v2/me'

# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('EMAIL_HOST')
EMAIL_PORT = int(os.getenv('EMAIL_PORT'))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True').lower() == 'true'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL')

# Discord OAuth Configuration
OAUTH_DISCORD_CLIENT_ID = os.getenv('OAUTH_DISCORD_CLIENT_ID')
OAUTH_DISCORD_CLIENT_SECRET = os.getenv('OAUTH_DISCORD_CLIENT_SECRET')
OAUTH_DISCORD_REDIRECT_URI = os.getenv('OAUTH_DISCORD_REDIRECT_URI')
OAUTH_DISCORD_TOKEN_URL = 'https://discord.com/api/oauth2/token'
DISCORD_OAUTH_URL = f"https://discord.com/oauth2/authorize?client_id={OAUTH_DISCORD_CLIENT_ID}&response_type=code&redirect_uri={OAUTH_DISCORD_REDIRECT_URI}&scope=email+identify"
DSCORD_API_V6 = 'https://discord.com/api/v6/users/@me'

OAUTH_DISCORD_CLIENT_ID = "1272193976983752706"
OAUTH_DISCORD_CLIENT_SECRET = "gDEzOmoJ_gNmEBP4IPAfN9v_S3oQn_tK"
OAUTH_DISCORD_REDIRECT_URI = 'http://127.0.0.1:8000/discord/login_redirect'
OAUTH_DISCORD_TOKEN_URL = 'https://discord.com/api/oauth2/token'
DISCORD_OAUTH_URL = "https://discord.com/oauth2/authorize?client_id=1272193976983752706&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A8000%2Fdiscord%2Flogin_redirect&scope=email+identify"
DSCORD_API_V6 = 'https://discord.com/api/v6/users/@me'


BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'django-insecure-!9+ns2!3$k!*vdvy1#i+l7$&l67w_4j(x$4ln2ij$+7dorextm')

DEBUG = True

ALLOWED_HOSTS = ['*']



TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],  # No custom template directories needed
        'APP_DIRS': True,  # Required for Django admin to work
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]



INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'django_crontab', 
    'corsheaders',
    'user_auth',
    'oauth2_discord',
    'oauth2_42',
]

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
]

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:5173',
]

CRONJOBS = [
    ('*/2 * * * *', 'user_auth.management.commands.cleanup_unvalidated_users.Command.handle')
]

CSRF_COOKIE_SECURE = False  # Set to True in production
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Lax'  # Can be 'Strict' in production if appropriate

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

ROOT_URLCONF = 'back_trans_proj.urls'

DATABASES = {
    'default': {
        'ENGINE': os.getenv('ENGINE_db'),  
        'NAME': os.getenv('DB_NAME'),  
        'USER': os.getenv('DB_USER'),  
        'PASSWORD': os.getenv('DB_PASSWORD'),  
        'HOST': os.getenv('DB_HOST'),  
        'PORT': os.getenv('DB_PORT'),  
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',  # This enforces authentication globally
    ),
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=3),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=20),
    "AUTH_HEADER_TYPES": ("Bearer",),
}

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

STATIC_URL = '/static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]

AUTH_USER_MODEL = 'user_auth.player'

MEDIA_URL = '/media/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
