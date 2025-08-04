from rest_framework.routers import DefaultRouter
from apps.notificaciones.views import NotificationViewSet

router_notificaciones = DefaultRouter()
router_notificaciones.register(r'notifications', NotificationViewSet, basename='notifications')