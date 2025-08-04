from django.db import models;
from apps.sanidad.api.models.ProductosControlModel import ProductosControl
from apps.sanidad.api.models.controlesModel import Controles;

class UsoProductosControl(models.Model):
    fk_ProductoControl = models.ForeignKey(ProductosControl, on_delete=models.SET_NULL, null=True
    )
    fk_Control = models.ForeignKey(Controles, on_delete=models.SET_NULL, null=True)
    cantidadProducto = models.IntegerField()

    def __str__(self):
        return self.fk_ProductoControl.nombre