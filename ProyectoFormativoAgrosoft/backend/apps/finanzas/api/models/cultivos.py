from django.db import models
from apps.trazabilidad.api.models.EspeciesModel import Especies

class Cultivos(models.Model):
    nombre = models.CharField(max_length=50,null=True,unique=True)
    activo = models.BooleanField(default=False, null=False)
    fk_Especie = models.ForeignKey(Especies,on_delete=models.SET_NULL, null=True)

    def save(self, *args, **kwargs):
        if self.nombre:
            self.nombre = self.nombre.capitalize()
        super().save(*args, **kwargs)

    def __str__(self):

        return (str(self.fk_Especie.nombre) + str(" ") + str(self.nombre))

      
class CoeficienteCultivo(models.Model):
    cultivo = models.ForeignKey(Cultivos, on_delete=models.CASCADE)
    fase_crecimiento = models.CharField(max_length=50)
    kc_valor = models.DecimalField(max_digits=5, decimal_places=2)
    dias_desde_siembra = models.IntegerField(help_text="Días desde siembra para esta fase")
    et_minima = models.DecimalField(max_digits=5, decimal_places=2,null=True, verbose_name="ET mínima (mm/día)")
    et_maxima = models.DecimalField(max_digits=5, decimal_places=2,null=True, verbose_name="ET máxima (mm/día)")
    humedad_optima_min = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        null=True,
        verbose_name="Humedad óptima mínima (%)"
    )
    humedad_optima_max = models.DecimalField(
        max_digits=5, 
        decimal_places=2,
        null=True,
        verbose_name="Humedad óptima máxima (%)"
    )
    
    class Meta:
        ordering = ['dias_desde_siembra']
    
    def __str__(self):
        return f"{self.cultivo.nombre} - {self.fase_crecimiento} (Kc: {self.kc_valor})"