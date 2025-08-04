from django.db import models
from apps.trazabilidad.api.models.HerramientasModel import Herramientas
from apps.finanzas.api.models.insumos import Insumos
from apps.finanzas.api.models.usosInsumos import UsosInsumos
from apps.trazabilidad.api.models.UsosHerramientasModel import UsosHerramientas
from apps.users.models import Usuario

class MovimientoInventario(models.Model):
    TIPO_CHOICES = [
        ('entrada', 'Entrada'),
        ('salida', 'Salida')
    ]
    tipo = models.CharField(max_length=30, choices=TIPO_CHOICES)
    fk_Insumo = models.ForeignKey(Insumos, models.SET_NULL, null=True, blank=True)
    fk_Herramienta = models.ForeignKey(Herramientas, models.SET_NULL, null=True, blank=True)
    fk_UsoInsumo = models.ForeignKey(UsosInsumos, models.SET_NULL, null=True, blank=True)
    fk_UsoHerramienta = models.ForeignKey(UsosHerramientas, models.SET_NULL, null=True, blank=True)
    unidades = models.IntegerField()
    fecha = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(Usuario, models.SET_NULL, null=True, blank=True, related_name='movimientos_inventario')

    def __str__(self):
        if self.fk_Insumo:
            return f"{self.tipo.title()} - {self.fk_Insumo.nombre}"
        elif self.fk_UsoInsumo:
            return f"{self.tipo.title()} - {self.fk_UsoInsumo.fk_Insumo.nombre}"
        return self.tipo

