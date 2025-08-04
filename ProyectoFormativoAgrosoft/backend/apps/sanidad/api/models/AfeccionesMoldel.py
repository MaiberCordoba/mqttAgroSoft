from django.db import models
from apps.sanidad.api.models.PlagaModel import Plaga
from apps.trazabilidad.api.models.PlantacionesModel import Plantaciones

class Afecciones(models.Model):
    estado_choises = [("ST", "ST"), ("EC", "EC"), ("EL", "EL")]

    fk_Plantacion = models.ForeignKey(Plantaciones,on_delete=models.SET_NULL,null=True)
    fk_Plaga = models.ForeignKey(Plaga, on_delete=models.SET_NULL, null=True)
    fechaEncuentro = models.DateField()
    estado = models.CharField(max_length=30, choices=estado_choises, default="ST")


    

    def __str__(self):
        return ("Plaga: " +str(self.fk_Plaga.nombre) + " cultivo: " + str(self.fk_Plantacion.fk_Cultivo) + " Era: " + str(self.fk_Plantacion.fk_Era))