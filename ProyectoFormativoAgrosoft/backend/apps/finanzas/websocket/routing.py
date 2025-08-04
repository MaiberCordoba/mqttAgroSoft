# apps/finanzas/routing.py
from django.urls import re_path
from apps.finanzas.websocket.finanzasConsumer import FinanzasConsumer

websocket_urlpatterns = [
    re_path(r"ws/notificaciones/(?P<user_id>\d+)/$", FinanzasConsumer.as_asgi()),
]