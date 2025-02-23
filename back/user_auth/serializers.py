from rest_framework import serializers
from .models import Player
import re

def normalize_fields(data):
    data['username'] = data.get('username', '').lower()
    data['email'] = data.get('email', '').lower()
    data['full_name'] = data.get('full_name', '').lower()
    return data



class PlayerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    re_password = serializers.CharField(write_only=True, required=False)
    profile_image = serializers.ImageField(default='profile_images/default_profile.jpeg')
    cover_image = serializers.ImageField(default='cover_pictures/Cover_Picture_1.png')

    class Meta:
        model = Player
        fields = [
            'username', 'full_name', 'email', 'password',  'is_validate' ,
            're_password', 'id_prov', 'prov_name', 'provider_identifier',
            'profile_image', 'cover_image', 'points','is_online',
            'level', 'total_games', 'win_games', 'lose_games',
            'win_1_game', 'win_3_games', 'win_10_games', 'win_30_games',
            'reach_level_5', 'reach_level_15', 'reach_level_30', 'perfect_win_game',
            'perfect_win_tournaments', 'active_2fa',
        ]
        extra_kwargs = {
            'username': {'required': True},
            'id_prov': {'required': False},
            'prov_name': {'required': False},
            'provider_identifier': {'read_only': True},
        }

    def validate_full_name(self, value):
        # Full name validation: 2-25 characters, only letters and spaces
        if not re.match(r'^[a-zA-Z ]+$', value):
            raise serializers.ValidationError("Full name must contain only letters and spaces.")
        if not (4 <= len(value) <= 25):
            raise serializers.ValidationError("Full name length must be between 4 and 25 characters.")
        return value

    def validate_username(self, value):
        # Username validation: 4-14 characters, only letters, numbers, hyphens, and underscores
        if not re.match(r'^[a-zA-Z0-9-_]+$', value):
            raise serializers.ValidationError("Username must contain only letters, numbers, hyphens, and underscores.")
        if 4 <= len(value) <= 14:
            return value
        elif 'prov_name' == "Discord" or 'prov_name' == "42":
            return value
        else:
            raise serializers.ValidationError("Username length must be between 4 and 14 characters.")
#  if 6 > len(value) or  len(value) > 40:
#             raise serializers.ValidationError("Password length must be between 6 and 30 characters.")
#         return value

    def validate_password(self, value):
        # Password validation: 2-40 characters
        if 6 > len(value) or  len(value) > 40:
            raise serializers.ValidationError("Password length must be between 6 and 30 characters.")
        return value

    def validate(self, data):
        # Convert empty strings to None
        data['id_prov'] = data.get('id_prov') or None
        data['prov_name'] = data.get('prov_name') or None

        # Enforce uniqueness only when both id_prov and prov_name are provided
        if data['id_prov'] and data['prov_name']:
            if Player.objects.filter(id_prov=data['id_prov'], prov_name=data['prov_name']).exists():
                raise serializers.ValidationError(
                    {"non_field_errors": "A user with this provider ID already exists."}
                )

        # Ensure passwords match
        if 'password' in data and 're_password' in data:
            if data['password'] != data['re_password']:
                raise serializers.ValidationError({"re_password": "Passwords do not match."})

        return data

    def create(self, validated_data):
        validated_data = normalize_fields(validated_data)
        validated_data.pop('re_password', None)
        is_oauth = 'prov_name' in validated_data and validated_data['prov_name']

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
