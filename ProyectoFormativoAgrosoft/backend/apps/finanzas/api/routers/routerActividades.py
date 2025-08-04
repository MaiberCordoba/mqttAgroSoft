from rest_framework.routers import DefaultRouter
from apps.finanzas.api.views.viewActividades import ViewActividades

routerActividades = DefaultRouter()
routerActividades.register(prefix="actividades",viewset=ViewActividades,basename="actividades")