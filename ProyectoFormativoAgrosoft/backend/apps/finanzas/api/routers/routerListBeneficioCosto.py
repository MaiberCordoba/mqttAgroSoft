from rest_framework.routers import DefaultRouter
from apps.finanzas.api.views.listaBeneceficioCosto import ListCultivoEconomicViewSet

routerListBeneficioCosto = DefaultRouter()
routerListBeneficioCosto.register(prefix='lista', viewset=ListCultivoEconomicViewSet, basename='cultivos-resumenes')