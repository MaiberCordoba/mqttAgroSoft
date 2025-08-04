from rest_framework.routers import DefaultRouter
from django.urls import path
from apps.electronica.api.views.sensor_views import SensoresView, SensorHistoryView

router_sensor= DefaultRouter()
router_sensor.register(r'sensor', SensoresView, basename='sensor')

urlpatterns = [
    path('sensor/history/', SensorHistoryView.as_view(), name='sensor-history'),
    path('sensor/<int:pk>/history/', SensorHistoryView.as_view(), name='sensor-specific-history'),
]