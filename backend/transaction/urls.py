from django.urls import path, include
from rest_framework.routers import DefaultRouter

from transaction.views import TransactionViewSet, CategoryViewSet

app_name = "transaction"

router = DefaultRouter()
router.register("transactions", TransactionViewSet)
router.register("categories", CategoryViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
