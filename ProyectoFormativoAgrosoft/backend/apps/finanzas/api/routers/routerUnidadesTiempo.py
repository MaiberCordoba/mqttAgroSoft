from rest_framework.routers import DefaultRouter
from apps.finanzas.api.views.viewUnidadesTiempo import viewUnidadesTiempo

routerUnidadesTiempo = DefaultRouter()
routerUnidadesTiempo.register(prefix="unidades-tiempo",viewset=viewUnidadesTiempo,basename="unidades-tiempo")