from rest_framework.routers import DefaultRouter
from apps.finanzas.api.views.beneficioCosto import CultivoEconomicViewSet

routerBeneficioCosto = DefaultRouter()
routerBeneficioCosto.register(r'cultivos', CultivoEconomicViewSet, basename='cultivos-economic')