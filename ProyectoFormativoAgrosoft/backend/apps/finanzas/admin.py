from django.contrib import admin
from apps.finanzas.api.models.tiposDesecho import TiposDesecho
from apps.finanzas.api.models.cultivos import Cultivos
from apps.finanzas.api.models.desechos import Desechos
from apps.finanzas.api.models.cosechas import Cosechas
from apps.finanzas.api.models.ventas import Ventas
from apps.finanzas.api.models.actividades import Actividades
from apps.finanzas.api.models.insumos import Insumos
from apps.finanzas.api.models.usosInsumos import UsosInsumos
from apps.finanzas.api.models.tipoActividad import TipoActividad
from apps.finanzas.api.models.unidadesTiempo import UnidadesTiempo
from apps.finanzas.api.models.unidadesMedida import UnidadesMedida
from apps.finanzas.api.models.salarios import Salarios
from apps.finanzas.api.models.tiempoActividadControl import TiempoActividadControl
from apps.finanzas.api.models.movimientosInventario import MovimientoInventario

# Register your models here.

admin.site.register(TiposDesecho)
admin.site.register(TipoActividad)
admin.site.register(Cultivos)
admin.site.register(Desechos)
admin.site.register(Cosechas)
admin.site.register(Ventas)
admin.site.register(Actividades)
admin.site.register(Insumos)
admin.site.register(UsosInsumos)
admin.site.register(UnidadesTiempo)
admin.site.register(UnidadesMedida)
admin.site.register(Salarios)
admin.site.register(TiempoActividadControl)
admin.site.register(MovimientoInventario)
