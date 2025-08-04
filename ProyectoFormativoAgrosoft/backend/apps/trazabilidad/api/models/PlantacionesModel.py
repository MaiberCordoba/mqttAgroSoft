from django.db import models
from apps.finanzas.api.models.cultivos import Cultivos
from apps.electronica.api.models.era import Eras
from apps.trazabilidad.api.models.SemillerosModel import Semilleros

class Plantaciones(models.Model):
    unidades = models.IntegerField()
    fechaSiembra = models.DateField(auto_now=False)
    fk_semillero = models.ForeignKey(Semilleros,on_delete=models.SET_NULL, null=True)
    fk_Cultivo = models.ForeignKey(Cultivos, on_delete=models.SET_NULL,null=True)
    fk_Era = models.ForeignKey(Eras, on_delete=models.SET_NULL,null=True)
    creado = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        info = []
        if self.fk_semillero: info.append(f"semillero: {self.fk_semillero}")
        if self.fk_Cultivo: info.append(f"cultivo: {self.fk_Cultivo}")
        if self.fk_Era: info.append(f"era: {self.fk_Era}")
        return " ".join(info) or "plantacion sin relaciones asignadas"