from django.db import models
from .TiposEspecieModel import TiposEspecie

class Especies(models.Model):
    class TiempoCrecimientoChoices(models.TextChoices):
        PERENNES = 'perennes', 'Perennes'
        SEMIPERENNES= 'semiperennes', 'Semiperennes'
        TRANSITORIO = 'transitorio', 'Transitorio'
    fk_tipoespecie = models.ForeignKey(TiposEspecie, on_delete=models.SET_NULL, null=True)
    nombre = models.CharField(max_length=30)
    descripcion = models.TextField(max_length=400)
    img = models.ImageField(upload_to="especies/", null=True, blank=True)
    tiempocrecimiento = models.CharField(
        max_length=15,
        choices=TiempoCrecimientoChoices.choices,
        default=TiempoCrecimientoChoices.PERENNES
    )

    def save(self, *args, **kwargs):
        if self.descripcion:
            self.descripcion = self.descripcion.capitalize()
        if self.nombre:
            self.nombre = self.nombre.capitalize()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre
