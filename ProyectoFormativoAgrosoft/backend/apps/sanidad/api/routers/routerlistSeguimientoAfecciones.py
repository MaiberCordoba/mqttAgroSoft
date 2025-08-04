from rest_framework.routers import DefaultRouter
from apps.sanidad.api.views.listarSeguimientoAfecciones import ListSeguimientoAfeccionesViewSet

routerListSeguimientoAfeccionesViewSet = DefaultRouter()
routerListSeguimientoAfeccionesViewSet.register(prefix='listar', viewset=ListSeguimientoAfeccionesViewSet, basename='controles-resumenes')