from rest_framework.routers import DefaultRouter
from apps.electronica.api.views.eras_views import *

router_era = DefaultRouter()
router_era.register(prefix= 'eras', viewset= Erasview, basename='eras')