from rest_framework.routers import DefaultRouter;
from apps.sanidad.api.views.controlesViews import ControleslModelViewSet;

router_controles = DefaultRouter()
router_controles.register(prefix='controles', basename='controles', viewset=ControleslModelViewSet)
