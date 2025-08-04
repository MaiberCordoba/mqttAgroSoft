from rest_framework.routers import DefaultRouter
from ..views.HerramientasViews import HerramientasViewSet

HerramientasRouter = DefaultRouter()
HerramientasRouter.register(prefix='herramientas', viewset=HerramientasViewSet, basename='herramientas')