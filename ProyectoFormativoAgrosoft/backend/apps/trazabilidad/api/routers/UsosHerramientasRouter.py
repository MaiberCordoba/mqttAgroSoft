from rest_framework.routers import DefaultRouter
from ..views.UsosHerramientasViews import UsosHerramientasViewSet

UsosHerramientasRouter = DefaultRouter()
UsosHerramientasRouter.register(prefix='usosherramientas', viewset=UsosHerramientasViewSet, basename='usosherramientas')