from django.db import models

class TiposDesecho(models.Model):
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