from django.db import models
from apps.trazabilidad.api.models.PlantacionesModel import Plantaciones
from apps.finanzas.api.models.unidadesMedida import UnidadesMedida

class Cosechas(models.Model):
    fk_Plantacion = models.ForeignKey(Plantaciones, on_delete=models.SET_NULL, null=True)
    fk_UnidadMedida = models.ForeignKey(UnidadesMedida, on_delete=models.SET_NULL, null=True)
    cantidad = models.IntegerField(null=True)
    precioUnidad = models.IntegerField(null=True)
    cantidadTotal = models.FloatField(null=True, blank=True)
    valorTotal = models.IntegerField(null=True,blank=True)
    valorGramo = models.DecimalField(max_digits=10,decimal_places=2,null=True,blank=True)
    fecha = models.DateField(auto_now=False)

    def __str__(self):
        return str(self.fecha) + "  COSECHA: " + str(self.fk_Plantacion)
