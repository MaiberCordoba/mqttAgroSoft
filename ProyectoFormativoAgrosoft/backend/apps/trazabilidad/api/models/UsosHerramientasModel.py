from django.db import models
from .HerramientasModel import Herramientas
from apps.finanzas.api.models.actividades import Actividades
from apps.sanidad.api.models.controlesModel import Controles

class UsosHerramientas(models.Model):
    fk_Herramienta = models.ForeignKey(Herramientas,on_delete=models.SET_NULL,null=True)
    fk_Actividad = models.ForeignKey(Actividades,on_delete=models.SET_NULL,null=True)
    fk_Control = models.ForeignKey(Controles,on_delete=models.SET_NULL,null=True)
    unidades = models.IntegerField(default=0)
    def __str__(self):
        return str(self.fk_Herramienta) + str(self.fk_Actividad)