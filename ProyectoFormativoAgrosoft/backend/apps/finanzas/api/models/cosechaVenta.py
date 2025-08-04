""" from django.db import models
from apps.finanzas.api.models.unidadesMedida import UnidadesMedida
from apps.finanzas.api.models.ventas import Ventas
from apps.finanzas.api.models.cosechas import Cosechas


class CosechaVenta(models.Model):
    fk_Venta = models.ForeignKey(Ventas, on_delete=models.SET_NULL, null=True, related_name="cosechas_venta")
    fk_Cosecha = models.ForeignKey(Cosechas, on_delete=models.SET_NULL, null=True)
    fk_UnidadMedida = models.ForeignKey(UnidadesMedida, on_delete=models.SET_NULL, null=True)
    precioUnitario = models.IntegerField()
    cantidad = models.IntegerField()
    valorTotal = models.IntegerField(blank=True, null=True)

    class Meta:
        unique_together = ('fk_Venta', 'fk_Cosecha')

    def __str__(self):
        return f"{self.fk_Cosecha} en venta #{self.fk_Venta.id}" """