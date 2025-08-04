from django.urls import path
from apps.electronica.api.views.evapotranspiracion_views import CalcularEvapotranspiracionView
from apps.electronica.api.views.evapotranspiracion_historica import EvapotranspiracionHistoricaView

urlpatterns = [
    path('evapotranspiracion/', CalcularEvapotranspiracionView.as_view(), name='evapotranspiracion'),
    path('evapotranspiracion/historica/', EvapotranspiracionHistoricaView.as_view(), name='evapotranspiracion_historica'),
]
