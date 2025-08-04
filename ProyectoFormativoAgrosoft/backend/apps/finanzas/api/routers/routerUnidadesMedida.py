from rest_framework.routers import DefaultRouter
from apps.finanzas.api.views.viewUnidadesMedida import viewUnidadesMedida

routerUnidadesMedida = DefaultRouter()
routerUnidadesMedida.register(prefix="unidades-medida",viewset=viewUnidadesMedida,basename="unidades-medida")