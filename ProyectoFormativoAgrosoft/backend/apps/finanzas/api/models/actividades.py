from django.db import models
from apps.finanzas.api.models.cultivos import Cultivos
from apps.finanzas.api.models.tipoActividad import TipoActividad
from apps.users.models import Usuario
from apps.trazabilidad.api.models.PlantacionesModel import Plantaciones

class Actividades(models.Model):
    ESTADO_CHOICES = [
        ('AS', "Asignada"),
        ('CO', "Completada"),
        ('CA', "Cancelada")
    ]

    fk_Cultivo = models.ForeignKey(Cultivos, on_delete=models.SET_NULL, null=True)
    fk_Plantacion = models.ForeignKey(Plantaciones, on_delete=models.SET_NULL, null=True)
    fk_Usuario = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True)
    fk_TipoActividad = models.ForeignKey(TipoActividad, on_delete=models.SET_NULL, null=True)
    titulo = models.CharField(max_length=50)
    descripcion = models.TextField(max_length=200)
    fecha = models.DateField(auto_now=False)  # Establece automáticamente la fecha al crear
    estado = models.CharField(max_length=3, choices=ESTADO_CHOICES, default='AS')

    def save(self, *args, **kwargs):
        if self.titulo:
            self.titulo = self.titulo.capitalize()
        if self.descripcion:
            self.descripcion = self.descripcion.capitalize()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"fecha: {self.fecha} titulo: {self.titulo} encargado: {self.fk_Usuario.nombre if self.fk_Usuario else 'Sin asignar'}"
