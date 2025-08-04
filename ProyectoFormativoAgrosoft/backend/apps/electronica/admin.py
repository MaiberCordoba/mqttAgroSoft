from django.contrib import admin
from apps.electronica.api.models.lote import Lote
from apps.electronica.api.models.era import Eras

# Register your models here.

admin.site.register(Lote)
admin.site.register(Eras)
