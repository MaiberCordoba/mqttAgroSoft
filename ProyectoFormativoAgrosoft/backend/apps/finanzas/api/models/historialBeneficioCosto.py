from django.db import models
from apps.finanzas.api.models.cultivos import Cultivos

class HistorialBeneficioCosto(models.Model):
    """
    Modelo para almacenar el historial de resúmenes económicos de un cultivo
    """
    fk_Cultivo = models.ForeignKey(Cultivos, on_delete=models.CASCADE, related_name='historial_beneficio_costo')
    fecha_registro = models.DateTimeField(auto_now_add=True)
    costo_insumos = models.IntegerField(default=0)
    total_mano_obra = models.IntegerField(default=0)
    total_depreciacion = models.IntegerField(default=0)  # Nuevo campo
    total_costos = models.IntegerField(default=0)
    total_ventas = models.IntegerField(default=0)
    beneficio = models.IntegerField(default=0)
    relacion_beneficio_costo = models.FloatField(default=0.0)

    class Meta:
        db_table = 'historial_beneficio_costo'
        verbose_name = 'Historial Beneficio Costo'
        verbose_name_plural = 'Historiales Beneficio Costo'
        indexes = [
            models.Index(fields=['fk_Cultivo', 'fecha_registro']),
        ]

    def __str__(self):
        return f"Historial {self.fk_Cultivo.nombre} - {self.fecha_registro.strftime('%Y-%m-%d %H:%M:%S')}"