from rest_framework.routers import DefaultRouter
from apps.finanzas.api.views.viewInsumos import ViewInsumos

routerInsumos = DefaultRouter()
routerInsumos.register(prefix="insumos",viewset=ViewInsumos,basename="insumos")