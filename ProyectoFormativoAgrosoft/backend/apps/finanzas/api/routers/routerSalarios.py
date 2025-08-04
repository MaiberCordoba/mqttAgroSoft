from rest_framework.routers import DefaultRouter
from apps.finanzas.api.views.viewSalarios import SalariosViewSet

routerSalarios = DefaultRouter()
routerSalarios.register(prefix="salarios",viewset=SalariosViewSet,basename="salarios")