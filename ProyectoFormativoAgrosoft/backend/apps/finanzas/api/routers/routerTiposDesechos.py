from rest_framework.routers import DefaultRouter
from apps.finanzas.api.views.viewTiposDesecho import ViewTiposDesecho

routerTiposDesecho = DefaultRouter()
routerTiposDesecho.register(prefix="tipos-desechos",viewset=ViewTiposDesecho,basename="tipos-desechos")