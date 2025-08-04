from django.contrib import admin

# Register your models here.
from .api.models.EspeciesModel import Especies
from .api.models.HerramientasModel import Herramientas
from .api.models.PlantacionesModel import Plantaciones
from .api.models.SemillerosModel import Semilleros
from .api.models.TiposEspecieModel import TiposEspecie
from .api.models.UsosHerramientasModel import UsosHerramientas

# Registrar los modelos en el admin
admin.site.register(Herramientas)
admin.site.register(Plantaciones)
admin.site.register(Semilleros)
admin.site.register(TiposEspecie)
admin.site.register(UsosHerramientas)
admin.site.register(Especies)