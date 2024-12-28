from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from .models import Member
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView

class Game_api_View(APIView):
    def get(self, request):
        return JsonResponse({"message": "Hello from Django!"})
