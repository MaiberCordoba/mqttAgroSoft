from rest_framework.routers import DefaultRouter;
from apps.sanidad.api.views.tiposControlViews import TiposControlModelViewSet;

router_tiposControl = DefaultRouter()
router_tiposControl.register(prefix='tiposControl', basename='tiposControl', viewset=TiposControlModelViewSet)