from rest_framework.routers import DefaultRouter
from apps.finanzas.api.views.viewCultivos import ViewCultivos

routerCultivos = DefaultRouter()
routerCultivos.register(prefix="cultivos",viewset=ViewCultivos,basename="cultivos")