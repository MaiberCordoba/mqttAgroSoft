from rest_framework.routers import DefaultRouter
from apps.sanidad.api.views.tipoPlagaViews import TipoPlagaModelViewSet

router_tipoPlaga = DefaultRouter()
router_tipoPlaga.register(prefix='tipoPlaga', basename='tipoPlaga', viewset=TipoPlagaModelViewSet)
