from django.db import models
from apps.finanzas.api.models.unidadesTiempo import UnidadesTiempo
from apps.finanzas.api.models.actividades import Actividades
from apps.sanidad.api.models.controlesModel import Controles
from apps.finanzas.api.models.salarios import Salarios

class TiempoActividadControl(models.Model):
    ESTADO_PAGO_CHOICES = [
        ('PENDIENTE', 'Pendiente'),
        ('PAGADO', 'Pagado'),
    ]

    tiempo = models.IntegerField(verbose_name="Cantidad de tiempo")
    fecha = models.DateTimeField(auto_now=True)
    valorTotal = models.IntegerField(verbose_name="Valor total", editable=False)
    estado_pago = models.CharField(
        max_length=10,
        choices=ESTADO_PAGO_CHOICES,
        default='PENDIENTE',
        verbose_name="Estado de pago"
    )
    fk_unidadTiempo = models.ForeignKey(UnidadesTiempo, on_delete=models.SET_NULL, null=True)
    fk_actividad = models.ForeignKey(Actividades, on_delete=models.SET_NULL, null=True, blank=True)
    fk_control = models.ForeignKey(Controles, on_delete=models.SET_NULL, null=True, blank=True)
    fk_salario = models.ForeignKey(Salarios, on_delete=models.SET_NULL, null=True)

    class Meta:
        verbose_name = "Registro de Tiempo"
        verbose_name_plural = "Registros de Tiempo"