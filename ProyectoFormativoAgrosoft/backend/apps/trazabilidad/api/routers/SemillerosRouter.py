from rest_framework.routers import DefaultRouter
from ..views.SemillerosViews import SemillerosViewSet

SemillerosRouter = DefaultRouter()
SemillerosRouter.register(prefix='semilleros', viewset=SemillerosViewSet, basename='semilleros')