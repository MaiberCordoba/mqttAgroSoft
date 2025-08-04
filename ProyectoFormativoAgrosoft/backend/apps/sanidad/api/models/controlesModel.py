from django.db import models
from apps.sanidad.api.models.AfeccionesMoldel import Afecciones
from apps.sanidad.api.models.TiposControlModel import TiposControl
from apps.users.models import Usuario

class Controles(models.Model):
    fk_Afeccion = models.ForeignKey(Afecciones, on_delete=models.SET_NULL, null=True)
    fk_TipoControl = models.ForeignKey(TiposControl, on_delete=models.SET_NULL, null=True)
    fk_Usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True)

    descripcion = models.TextField()
    fechaControl = models.DateField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.descripcion:
            self.descripcion = self.descripcion.capitalize()
        super().save(*args,**kwargs)
    

    def __str__(self):
        return self.descripcion
