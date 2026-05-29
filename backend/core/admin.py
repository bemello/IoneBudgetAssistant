from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from core import models


class UserAdmin(BaseUserAdmin):
    ordering = ["id"]
    list_display = ["id", "email", "name", "surname", "currency"]
    list_display_links = ["id", "email"]
    fieldsets = (
        (None, {"fields": ("id", "email", "password", "name", "surname", "currency", "profile_picture")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                )
            },
        ),
        (_("Important dates"), {"fields": ("last_login",)}),
    )
    readonly_fields = ["id", "last_login"]
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),  # CSS class
                "fields": (
                    "email",
                    "password1",
                    "password2",
                    "name",
                    "surname",
                    "currency",
                    "profile_picture",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                ),
            },
        ),
    )


class AccessHistoryAdmin(admin.ModelAdmin):
    list_display = ("access_time", "ip_address", "location", "device", "os", "browser")
    list_filter = ("access_time", "location", "device", "os", "browser")
    search_fields = ("ip_address", "location", "device", "os", "browser")
    ordering = ("-access_time",)
    readonly_fields = ("id", "access_time", "ip_address", "browser", "os", "device", "location")
    date_hierarchy = "access_time"


class BaseModelAdmin(admin.ModelAdmin):
    list_display = ("id", "__str__")
    list_display_links = ("id", "__str__")
    ordering = ["id"]
    readonly_fields = ("id",)


admin.site.register(models.User, UserAdmin)
admin.site.register(models.AccessHistory, AccessHistoryAdmin)
admin.site.register(models.Account, BaseModelAdmin)
admin.site.register(models.Category, BaseModelAdmin)
admin.site.register(models.CategoryBudget, BaseModelAdmin)
admin.site.register(models.RecurringRule, BaseModelAdmin)
admin.site.register(models.Transaction, BaseModelAdmin)
admin.site.register(models.Vault, BaseModelAdmin)
admin.site.register(models.VaultContributions, BaseModelAdmin)
