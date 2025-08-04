""" from rest_framework.routers import DefaultRouter
from apps.finanzas.api.views.viewCosechaVenta import ViewCosechaVenta

routerCosechaVenta = DefaultRouter()
routerCosechaVenta.register(prefix="cosecha-venta",viewset=ViewCosechaVenta,basename="cosecha-venta") """