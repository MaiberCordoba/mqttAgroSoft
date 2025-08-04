from rest_framework.routers import DefaultRouter
from apps.sanidad.api.views.plagaViews import PlagaModelViewSet

router_plaga = DefaultRouter()
router_plaga.register(prefix='plaga', basename='plaga', viewset=PlagaModelViewSet)
