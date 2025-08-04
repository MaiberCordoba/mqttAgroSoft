from django.db import models

class TiposControl(models.Model):
    nombre = models.CharField(max_length=30,null=False,unique=True)
    descripcion = models.TextField()


    def save(self, *args, **kwargs):
        if self.nombre:
            self.nombre = self.nombre.capitalize()
        if self.descripcion:
            self.descripcion = self.descripcion.capitalize()
        super().save(*args,**kwargs)

    def __str__(self):
        return self.nombre