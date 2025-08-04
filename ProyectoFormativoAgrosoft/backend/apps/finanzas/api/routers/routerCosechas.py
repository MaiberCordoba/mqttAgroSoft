from rest_framework.routers import DefaultRouter
from apps.finanzas.api.views.viewCosechas import ViewCosechas

routerCosechas = DefaultRouter()
routerCosechas.register(prefix="cosechas",viewset=ViewCosechas,basename="cosechas")