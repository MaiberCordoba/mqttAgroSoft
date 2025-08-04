from django.db import models
from django.core.exceptions import ValidationError
from apps.finanzas.api.models.actividades import Actividades
from apps.finanzas.api.models.insumos import Insumos
from apps.sanidad.api.models.controlesModel import Controles
from apps.finanzas.api.models.unidadesMedida import UnidadesMedida

class UsosInsumos(models.Model):
    fk_Insumo = models.ForeignKey(Insumos, on_delete=models.SET_NULL, null=True)
    fk_Actividad = models.ForeignKey(Actividades, on_delete=models.SET_NULL, null=True, blank=True)
    fk_Control = models.ForeignKey(Controles, on_delete=models.SET_NULL, null=True, blank=True)
    cantidadProducto = models.IntegerField()
    fk_UnidadMedida = models.ForeignKey(UnidadesMedida, on_delete=models.SET_NULL, null=True)
    costoUsoInsumo = models.IntegerField(null=True, blank=True)

    def clean(self):
        if self.fk_Actividad and self.fk_Control:
            raise ValidationError("Solo se puede relacionar con una actividad o un control, no ambos.")
        if not self.fk_Actividad and not self.fk_Control:
            raise ValidationError("Debe relacionarse con una actividad o un control.")

    def __str__(self):
        return f"Insumo: {self.fk_Insumo} - Cantidad: {self.cantidadProducto}"
