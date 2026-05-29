from django.urls import path, include

from rest_framework.routers import DefaultRouter

from account import views

app_name = "account"

router = DefaultRouter()
router.register("accounts", views.AccountViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
