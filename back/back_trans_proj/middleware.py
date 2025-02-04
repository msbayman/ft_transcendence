from rest_framework_simplejwt.exceptions import InvalidToken, TokenError, AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication

from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from asgiref.sync import sync_to_async
from urllib.parse import parse_qs
from http.cookies import SimpleCookie


class JwtAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = scope.get('query_string', b'').decode('utf-8')
        query_params = parse_qs(query_string)
        access_token_query = query_params.get('token', [None])[0]
        access_token = access_token_query

        if access_token:
            try:
                validated_token = JWTAuthentication().get_validated_token(raw_token=access_token)
                user = await sync_to_async(JWTAuthentication().get_user)(validated_token)
                scope['user'] = user
            except (InvalidToken, TokenError, AuthenticationFailed) as e:
                scope['user'] = AnonymousUser()
        else:
            scope['user'] = AnonymousUser()

        return await super().__call__(scope, receive, send)
