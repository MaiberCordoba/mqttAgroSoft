from django.db import models

class TipoActividad(models.Model):
    nombre = models.CharField(max_length=70)

    def save(self, *args, **kwargs):
        if self.nombre:
            self.nombre = self.nombre.capitalize()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre