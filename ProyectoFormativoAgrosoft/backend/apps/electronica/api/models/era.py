from django.db import models
from apps.electronica.api.models.lote import Lote

class Eras(models.Model):
    fk_lote = models.ForeignKey(Lote, on_delete=models.SET_NULL, null=True) 
    tipo = models.CharField(max_length=20)
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

    def save(self, *args, **kwargs):
        if self.tipo:
            self.tipo = self.tipo.capitalize()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Era {self.tipo} en {self.fk_lote.nombre if self.fk_lote else 'sin lote'}"