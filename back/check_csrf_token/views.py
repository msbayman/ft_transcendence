from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
def validate_token(request):
    if not request.user.is_authenticated:
        return Response({"detail": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        
    return Response({"detail": "Valid token"}, status=status.HTTP_200_OK)
