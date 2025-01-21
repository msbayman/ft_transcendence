from pathlib import Path
from datetime import timedelta
import os
from dotenv import load_dotenv 
# from django.contrib.auth.models import User  # Ensure no unexpected indentation here

load_dotenv()



# 42 OAuth Configuration
OAUTH_42_CLIENT_ID = os.getenv('OAUTH_42_CLIENT_ID')
OAUTH_42_CLIENT_SECRET = os.getenv('OAUTH_42_CLIENT_SECRET')
OAUTH_42_REDIRECT_URI = os.getenv('OAUTH_42_REDIRECT_URI')
OAUTH_42_AUTHORIZATION_URL = 'https://api.intra.42.fr/oauth/authorize'
OAUTH_42_TOKEN_URL = 'https://api.intra.42.fr/oauth/token'
OAUTH_42_USER_INFO_URL = 'https://api.intra.42.fr/v2/me'

OAUTH_DISCORD_CLIENT_ID = os.getenv('OAUTH_DISCORD_CLIENT_ID')
OAUTH_DISCORD_CLIENT_SECRET = os.getenv('OAUTH_DISCORD_CLIENT_SECRET')
DISCORD_OAUTH_URL = os.getenv('DISCORD_OAUTH_URL')
OAUTH_DISCORD_REDIRECT_URI = os.getenv('OAUTH_DISCORD_REDIRECT_URI')
OAUTH_DISCORD_TOKEN_URL = 'https://discord.com/api/oauth2/token'
DSCORD_API_V6 = 'https://discord.com/api/v6/users/@me'

# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.getenv('EMAIL_HOST')
EMAIL_PORT = int(os.getenv('EMAIL_PORT'))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True').lower() == 'true'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL')

# settings.py


BASE_DIR = Path(__file__).resolve().parent.parent

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'json': {
            'class': 'pythonjsonlogger.jsonlogger.JsonFormatter',
            'format': '%(asctime)s %(levelname)s %(name)s %(message)s'
        },
    },
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'logs/django_debug.log'),  # Use a dedicated logs directory
            'formatter': 'json',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
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
    'daphne',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework', 
    'corsheaders',
    'user_auth',
    'oauth2_discord',
    'oauth2_42',
    'game',
    'channels',
    'chat',
    'listfriends'
]

# CORS_ALLOWED_ORIGINS = [
#     'https://localhost',
#     'https://127.0.0.1',

# ]

# CORS_ORIGIN_WHITELIST = (
#     'https://localhost',
#     'https://127.0.0.1',
# )
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
        'ENGINE': 'django.db.backends.postgresql',  
        'NAME': 'postgres_db',  
        'USER': os.getenv('DB_USER'),  
        'PASSWORD': os.getenv('DB_PASSWORD'),  
        'HOST': 'db',  
        'PORT': '5432',  
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

ASGI_APPLICATION = "back_trans_proj.asgi.application"
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [("redis", 6379)],
        },
    },
}

# MEDIA_URL = '/media/'
MEDIA_URL = '/media/'
MEDIA_ROOT = '/app/media'  

# CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_ALL_ORIGINS = True
