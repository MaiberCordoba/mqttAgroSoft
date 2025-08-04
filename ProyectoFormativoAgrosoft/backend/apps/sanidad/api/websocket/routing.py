from django.urls import re_path
from apps.sanidad.api.websocket.controlesConsumer import ControlesConsumer

websocket_urlpatterns = [
    re_path(r"ws/controles/notificaciones/(?P<user_id>\d+)/$", ControlesConsumer.as_asgi()),
]