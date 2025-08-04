from django.urls import re_path
from apps.electronica.api.consumers.sensor import SensorConsumer

websocket_urlpatterns = [
    re_path(r'^ws/sensor/?$', SensorConsumer.as_asgi()),
    re_path(r'^ws/sensor/(?P<sensor_id>\d+)/?$', SensorConsumer.as_asgi()),
]