from rest_framework.routers import DefaultRouter
from apps.finanzas.api.views.viewDesechos import ViewDesechos

routerDesechos = DefaultRouter()
routerDesechos.register(prefix="desechos",viewset=ViewDesechos,basename="desechos")