from rest_framework.routers import DefaultRouter;
from apps.sanidad.api.views.usosProductosControlViews import UsoProductosControlModelViewSet;

router_usoProductosControl = DefaultRouter()
router_usoProductosControl.register(prefix='usoproductosControl', basename='usoproductosControl', viewset=UsoProductosControlModelViewSet)
