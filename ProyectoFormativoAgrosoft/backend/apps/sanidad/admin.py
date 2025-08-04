from django.contrib import admin;
from apps.sanidad.api.models.tipoPlaga import tipoPlaga;
from apps.sanidad.api.models.PlagaModel import Plaga;
from apps.sanidad.api.models.AfeccionesMoldel import Afecciones;
from apps.sanidad.api.models.TiposControlModel import TiposControl;
from apps.sanidad.api.models.controlesModel import Controles;
from apps.sanidad.api.models.ProductosControlModel import ProductosControl;
from apps.sanidad.api.models.UsoProductosControlModel import UsoProductosControl;


admin.site.register(tipoPlaga)
admin.site.register(Plaga)
admin.site.register(Afecciones)
admin.site.register(TiposControl)
admin.site.register(Controles)
admin.site.register(ProductosControl)
admin.site.register(UsoProductosControl)
