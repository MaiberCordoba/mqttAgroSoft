from django.db import models
from apps.finanzas.api.models.unidadesMedida import UnidadesMedida

class Insumos(models.Model):
    nombre = models.CharField(max_length=30)
    descripcion = models.TextField(max_length=150)
    precio = models.IntegerField()
    compuestoActivo = models.CharField(max_length=20, null=True)
    contenido = models.FloatField(null=True)
    fichaTecnica = models.ImageField(upload_to="insumos/",null=True,blank=True)
    unidades = models.IntegerField()
    fk_UnidadMedida = models.ForeignKey(UnidadesMedida , on_delete=models.SET_NULL, null=True)

    totalGramos = models.IntegerField(null=True, blank=True)
    cantidadGramos = models.IntegerField(null=True, blank=True)
    valorTotalInsumos = models.FloatField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.nombre:
            self.nombre = self.nombre.capitalize()
        if self.descripcion:
            self.descripcion = self.descripcion.capitalize()
        if self.compuestoActivo:
            self.compuestoActivo = self.compuestoActivo.capitalize()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre
