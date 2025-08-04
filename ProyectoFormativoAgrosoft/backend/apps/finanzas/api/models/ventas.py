from django.db import models
from apps.finanzas.api.models.cosechas import Cosechas
from apps.finanzas.api.models.unidadesMedida import UnidadesMedida

class Ventas(models.Model):
    fk_Cosecha = models.ForeignKey(Cosechas, on_delete=models.SET_NULL, null=True)
    fecha = models.DateField(auto_now=True)
    fk_UnidadMedida = models.ForeignKey(UnidadesMedida, on_delete=models.SET_NULL, null=True)
    cantidad = models.IntegerField()
    descuento = models.IntegerField(null=True)
    valorTotal = models.IntegerField(blank=True, null=True)

    def __str__(self):
        return 'FECHA VENTA: ' + str(self.fecha) + ' COSECHA: ' + str(self.fk_Cosecha)
