from rest_framework.routers import DefaultRouter
from apps.finanzas.api.views.viewTipoActividad import ViewTipoActividad

routerTipoActividad = DefaultRouter()
routerTipoActividad.register(prefix="tipo-actividad",viewset=ViewTipoActividad,basename="tipo-actividad")