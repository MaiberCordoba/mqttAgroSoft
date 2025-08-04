from django.db import models;
from apps.sanidad.api.models.tipoPlaga import tipoPlaga;

class Plaga(models.Model):
    fk_Tipo = models.ForeignKey(tipoPlaga, on_delete=models.SET_NULL, null=True)
    nombre = models.CharField(max_length=30,null=False,unique=True)
    descripcion = models.TextField()
    img = models.ImageField(upload_to="plaga/", null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.nombre:
            self.nombre = self.nombre.capitalize()
        if self.descripcion:
            self.descripcion = self.descripcion.capitalize()
        super().save(*args,**kwargs)

    def __str__(self):
        return self.nombre