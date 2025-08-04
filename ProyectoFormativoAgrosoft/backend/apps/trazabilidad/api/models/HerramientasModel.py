from django.db import models

class Herramientas(models.Model):
    fk_Lote = models.IntegerField()
    nombre = models.CharField(max_length=30)
    descripcion = models.CharField(max_length=200)
    unidades = models.IntegerField()
    precio = models.IntegerField()
    valorTotal = models.IntegerField()

    def __str__(self):
        return self.nombre