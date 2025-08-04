from django.db import models;
from apps.sanidad.api.models.tipoPlaga import tipoPlaga;

class ProductosControl(models.Model):
    nombre = models.CharField(max_length=30)
    precio = models.IntegerField()
    compuestoActivo = models.CharField(max_length=20)
    fichaTecnica = models.TextField()
    contenido = models.IntegerField()
    tipoContenido = models.CharField(max_length=10)
    unidades = models.SmallIntegerField()
    
    def __str__(self):
        return self.nombre
