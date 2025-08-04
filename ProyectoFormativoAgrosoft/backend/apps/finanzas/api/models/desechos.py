from django.db import models
from apps.trazabilidad.api.models.PlantacionesModel import Plantaciones
from apps.finanzas.api.models.tiposDesecho import TiposDesecho

class Desechos(models.Model):
    fk_Plantacion = models.ForeignKey(Plantaciones, on_delete=models.SET_NULL, null=True)
    fk_TipoDesecho = models.ForeignKey(TiposDesecho, on_delete=models.SET_NULL, null= True)
    nombre = models.CharField(max_length=50)
    descripcion = models.TextField(max_length=200)

    def save(self, *args, **kwargs):
        if self.nombre:
            self.nombre = self.nombre.capitalize()
        if self.descripcion:
            self.descripcion = self.descripcion.capitalize()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre