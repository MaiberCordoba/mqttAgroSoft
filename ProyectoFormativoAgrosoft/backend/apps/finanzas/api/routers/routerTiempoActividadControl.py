from rest_framework.routers import DefaultRouter
from apps.finanzas.api.views.viewTiempoActividadControl import ViewTiempoActividadControl

routerTAC = DefaultRouter()
routerTAC.register(prefix="tiempoActividadesControles", viewset=ViewTiempoActividadControl, basename="tiempoActividadesControles")
