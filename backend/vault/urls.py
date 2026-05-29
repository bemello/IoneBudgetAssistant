from django.urls import path, include
from rest_framework.routers import DefaultRouter

from vault.views import VaultViewSet

app_name = "vault"

router = DefaultRouter()
router.register("vaults", VaultViewSet)
# router.register("vault-contributions", VaultContributionsViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
