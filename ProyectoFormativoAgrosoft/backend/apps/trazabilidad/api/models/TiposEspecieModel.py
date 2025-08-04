from django.db import models

class TiposEspecie(models.Model):
    nombre = models.CharField(max_length=30)
    descripcion = models.TextField(max_length=400)
    img = models.ImageField(upload_to="tiposespecie/", null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.nombre:
            self.nombre = self.nombre.capitalize()
        if self.descripcion:
            self.descripcion = self.descripcion.capitalize()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre