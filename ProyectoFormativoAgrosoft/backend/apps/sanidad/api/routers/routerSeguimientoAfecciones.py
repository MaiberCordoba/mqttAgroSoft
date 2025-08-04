from rest_framework.routers import DefaultRouter
from apps.sanidad.api.views.seguimientoAfecciones import ListSeguimientoAfeccionesViewSet


routerSeguimientoAfecciones = DefaultRouter()
routerSeguimientoAfecciones.register(r'controles', ListSeguimientoAfeccionesViewSet, basename='controles-seguimiento')