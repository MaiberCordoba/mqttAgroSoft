from rest_framework.routers import DefaultRouter
from ..views.PlantacionesViews import PlantacionesViewSet

PlantacionesRouter = DefaultRouter()
PlantacionesRouter.register(prefix='plantaciones', viewset=PlantacionesViewSet, basename='plantaciones')
