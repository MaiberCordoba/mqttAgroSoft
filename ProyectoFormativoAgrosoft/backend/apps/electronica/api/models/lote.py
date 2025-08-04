from decimal import Decimal
import math
from django.db import models


class Lote(models.Model):
    nombre = models.CharField(max_length=15, unique=True)
    descripcion = models.TextField()
    #esquina inferior Izquierda
    latI1 = models.FloatField(null=True, unique=True)  
    longI1 = models.FloatField(null=True, unique=True)
    #esquina superior Izquierda
    latS1 = models.FloatField(null=True, unique=True)  
    longS1 = models.FloatField(null=True, unique=True)
    #esquina inferior Derecha
    latI2 = models.FloatField(null=True, unique=True)  
    longI2 = models.FloatField(null=True, unique=True)
    #esquina superior Derecha
    latS2 = models.FloatField(null=True, unique=True)  
    longS2 = models.FloatField(null=True, unique=True)
    estado = models.BooleanField(null=True, default=True)

    def save(self, *args, **kwargs):
        if self.nombre:
            self.nombre = self.nombre.capitalize()
        if self.descripcion:
            self.descripcion = self.descripcion.capitalize()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.nombre