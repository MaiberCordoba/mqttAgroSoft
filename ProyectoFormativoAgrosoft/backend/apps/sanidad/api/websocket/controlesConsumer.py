import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.mail import send_mail
from django.conf import settings

class ControlesConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Maneja la conexión WebSocket."""
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.user_group = f"controles_notificaciones_{self.user_id}"

        # Agrega el usuario al grupo de notificaciones
        await self.channel_layer.group_add(self.user_group, self.channel_name)
        await self.accept()

        # Mensaje indicando quién se ha conectado
        await self.send(text_data=json.dumps({
            "message": f"El usuario {self.user_id} se ha conectado a notificaciones de controles"
        }))

    async def disconnect(self, close_code):
        """Maneja la desconexión WebSocket."""
        await self.channel_layer.group_discard(self.user_group, self.channel_name)

    async def send_notification(self, event):
        """Recibe la notificación desde la vista y la envía al usuario."""
        message = event["message"]
        email = event.get("email")
        
        # Envía la notificación por WebSocket
        await self.send(text_data=json.dumps({
            "notification": message,
            "type": "control_asignado"
        }))
        
        # Si hay email, envía también por correo
        if email:
            try:
                send_mail(
                    subject="Nuevo control asignado",
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=False,
                )
            except Exception as e:
                print(f"Error enviando email: {e}")