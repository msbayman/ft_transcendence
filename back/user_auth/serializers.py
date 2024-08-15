from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import Player
import re

class PlayerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    re_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Player
        fields = ['username', 'full_name', 'email', 'password', 're_password', 'id_prov', 'prov_name', 'provider_identifier']
        extra_kwargs = {
            'username': {'required': True},
            'id_prov': {'required': False},
            'prov_name': {'required': False},
            'provider_identifier': {'read_only': True},
        }

    def validate(self, data):
        if 'prov_name' not in data:  # Traditional sign-up
            if not data.get('password'):
                raise serializers.ValidationError({"password": "Password is required for traditional sign-up."})
            if data.get('password') != data.get('re_password'):
                raise serializers.ValidationError({"re_password": "Passwords do not match."})
            validate_password(data['password'])
        return data

    def create(self, validated_data):
        is_oauth = 'prov_name' in validated_data
        
        if is_oauth:
            player = self.get_or_create_oauth_user(validated_data)
        else:
            player = self.create_traditional_user(validated_data)
        
        return player

    def get_or_create_oauth_user(self, validated_data):
        email = validated_data.get('email')
        id_prov = validated_data.get('id_prov')
        prov_name = validated_data.get('prov_name')

        player, created = Player.objects.get_or_create(
            email=email,
            defaults={
                'username': self.generate_unique_username(validated_data.get('username', '')),
                'full_name': validated_data.get('full_name', ''),
                'id_prov': id_prov,
                'prov_name': prov_name,
            }
        )

        if not created:
            player.id_prov = id_prov
            player.prov_name = prov_name
            player.full_name = validated_data.get('full_name', player.full_name)
            player.save()

        return player

    def create_traditional_user(self, validated_data):
        validated_data.pop('re_password', None)
        password = validated_data.pop('password')
        player = Player(**validated_data)
        player.set_password(password)
        player.save()
        return player

    def generate_unique_username(self, base_username):
        username = base_username
        counter = 1
        while Player.objects.filter(username=username).exists():
            username = f"{base_username}_{counter}"
            counter += 1
        return username