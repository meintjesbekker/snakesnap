from rest_framework import serializers
from .models import SnakeSighting


class SnakeSightingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SnakeSighting
        fields = '__all__'
        read_only_fields = ['created_at']
