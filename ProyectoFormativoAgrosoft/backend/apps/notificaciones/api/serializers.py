# apps/notifications/serializers.py
from rest_framework import serializers
from apps.notificaciones.models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'notification_type', 'is_read', 'created_at', 'metadata']
        read_only_fields = fields