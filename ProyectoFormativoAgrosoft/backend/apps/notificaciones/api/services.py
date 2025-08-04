# apps/notifications/services.py
from apps.notificaciones.models import Notification
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Q
from datetime import timedelta
from django.utils import timezone

class NotificationService:
    @staticmethod
    def create_notification(user, title, message, notification_type, 
                          related_object=None, metadata=None, send_email=True):
        """
        Crea una notificación y la envía por WebSocket y/o email, evitando duplicados
        """
        # Verificar si ya existe una notificación similar en los últimos 5 minutos
        recent_time = timezone.now() - timedelta(minutes=5)
        existing_notification = Notification.objects.filter(
            user=user,
            title=title,
            message=message,
            notification_type=notification_type,
            created_at__gte=recent_time
        ).first()

        if existing_notification:
            print(f"Notificación duplicada detectada para usuario {user.id}, título: {title}")
            return existing_notification

        # Crear notificación en la base de datos
        notification = Notification.objects.create(
            user=user,
            title=title,
            message=message,
            notification_type=notification_type,
            metadata=metadata or {}
        )
        
        if related_object:
            notification.related_object_id = related_object.id
            notification.related_content_type = related_object.__class__.__name__
            notification.save()
        
        # Preparar datos para WebSocket
        notification_data = {
            "id": notification.id,
            "title": title,
            "message": message,
            "type": notification_type,
            "is_read": False,
            "created_at": notification.created_at.isoformat(),
            "metadata": metadata or {},
            "send_email": send_email
        }
        
        # Enviar por WebSocket
        channel_layer = get_channel_layer()
        if channel_layer:
            user_group = f"user_{user.id}_notifications"
            async_to_sync(channel_layer.group_send)(
                user_group,
                {
                    "type": "send_notification",
                    "notification": notification_data
                }
            )

        # Enviar correo electrónico si es necesario
        if send_email and user.correoElectronico:
            try:
                send_mail(
                    subject=title,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user.correoElectronico],
                    fail_silently=False,
                )
            except Exception as e:
                print(f"Error enviando email a {user.correoElectronico}: {e}")

        return notification