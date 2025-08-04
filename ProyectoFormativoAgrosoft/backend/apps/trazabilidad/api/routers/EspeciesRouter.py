from rest_framework.routers import DefaultRouter
from ..views.EspeciesViews import EspeciesViewSet

EspeciesRouter = DefaultRouter()
EspeciesRouter.register(prefix='especies', viewset=EspeciesViewSet, basename='especies')