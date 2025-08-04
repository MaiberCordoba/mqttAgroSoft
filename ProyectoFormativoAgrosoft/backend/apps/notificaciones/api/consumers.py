# apps/notifications/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Maneja la conexión WebSocket."""
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.user_group = f"user_{self.user_id}_notifications"

        # Agrega el usuario al grupo de notificaciones
        await self.channel_layer.group_add(self.user_group, self.channel_name)
        await self.accept()

        await self.send(text_data=json.dumps({
            "type": "connection_established",
            "message": f"Conectado a notificaciones para usuario {self.user_id}"
        }))

    async def disconnect(self, close_code):
        """Maneja la desconexión WebSocket."""
        await self.channel_layer.group_discard(self.user_group, self.channel_name)

    async def send_notification(self, event):
        """Envía notificación al usuario por WebSocket."""
        notification = event["notification"]
        
        # Envía la notificación por WebSocket
        await self.send(text_data=json.dumps({
            "type": "notification",
            "notification": notification
        }))