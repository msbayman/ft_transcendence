from rest_framework import serializers
from user_auth.models import Player
from .models import Message

class PlayerSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(default='profile_images/default_profile.jpeg')

    class Meta:
        model = Player
        fields = ['id', 'username', 'profile_image', 'is_online']

class ConversationSerializer(serializers.ModelSerializer):
    sender = serializers.CharField(source='sender.username', read_only=True)
    receiver = serializers.CharField(source='receiver.username', read_only=True)
    sender_profile_image = serializers.ImageField(source='sender.profile_image', read_only=True)
    receiver_profile_image = serializers.ImageField(source='receiver.profile_image', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'content', 'timestamp', 'is_read', 'sender_profile_image', 'receiver_profile_image']
    
        