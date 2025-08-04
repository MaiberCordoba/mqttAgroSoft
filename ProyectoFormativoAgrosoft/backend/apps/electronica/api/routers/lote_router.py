from rest_framework.routers import DefaultRouter
from apps.electronica.api.views.lote_views import *

router_Lote = DefaultRouter()
router_Lote.register(prefix= 'lote', viewset= LoteView, basename='lote')