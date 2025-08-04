from rest_framework.routers import DefaultRouter
from ..views.TiposEspecieViews import TiposEspecieViewSet

TiposEspecieRouter = DefaultRouter()
TiposEspecieRouter.register(prefix='tiposespecie', viewset=TiposEspecieViewSet, basename='tiposespecie')