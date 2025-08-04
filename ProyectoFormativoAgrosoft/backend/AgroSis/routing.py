# AgroSis/routing.py (este es el archivo principal)
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from apps.notificaciones.api.routing import websocket_urlpatterns as notificaciones_routing
from apps.electronica.api.consumers.routing import websocket_urlpatterns as electronica_routing

# Combina todos los patrones de WebSocket
websocket_urlpatterns = notificaciones_routing + electronica_routing

application = ProtocolTypeRouter({
    "websocket": URLRouter(websocket_urlpatterns),
})