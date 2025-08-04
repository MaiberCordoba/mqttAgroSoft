from rest_framework.routers import DefaultRouter
from apps.finanzas.api.views.viewMovimientoInventario import ViewMovimientoInventario

routerMovimientoInventario = DefaultRouter()
routerMovimientoInventario.register(prefix="movimiento-inventario",viewset=ViewMovimientoInventario,basename="movimiento-inventario")