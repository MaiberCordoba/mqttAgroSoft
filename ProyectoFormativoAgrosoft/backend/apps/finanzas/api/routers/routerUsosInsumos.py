from rest_framework.routers import DefaultRouter
from apps.finanzas.api.views.viewUsosInsumos import ViewUsosInsumos

routerUsosInsumos = DefaultRouter()
routerUsosInsumos.register(prefix="usos-insumos",viewset=ViewUsosInsumos,basename="usos-insumos")