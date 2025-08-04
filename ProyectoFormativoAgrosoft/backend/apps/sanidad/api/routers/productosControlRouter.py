from rest_framework.routers import DefaultRouter
from apps.sanidad.api.views.productosControlViews import ProductosControlModelViewSet

router_productosControl = DefaultRouter()
router_productosControl.register(prefix='productosControl', basename='productosControl', viewset=ProductosControlModelViewSet)
