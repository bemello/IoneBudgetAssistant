from django.utils import timezone
from datetime import timedelta
from django.core.validators import MinValueValidator
from django.core.validators import MaxValueValidator
import uuid
import os

from django.conf import settings
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)

# def [MODULE_NAME]_image_file_path(instance, filename):
#     ext = os.path.splitext(filename)[1]
#     filename = f'{uuid.uuid4()}{ext}'

#     return os.path.join('uploads', '[MODULE_NAME]', filename)


class UserManager(BaseUserManager):
    """
    Manager for users
    """

    def create_user(self, email, password=None, **extra_fields):
        """
        Create, save and return a new user
        """
        if not email:
            raise ValueError("User must have an email address")

        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password):
        """
        Create and return a new superuser
        """
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class AccessHistory(models.Model):
    access_time = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField()
    browser = models.CharField(max_length=100)
    os = models.CharField(max_length=100)
    device = models.CharField(max_length=100)
    location = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.access_time} - {self.ip_address}"


class User(AbstractBaseUser, PermissionsMixin):
    """
    Docstring for User
    Custom User
    """

    email = models.EmailField(max_length=30, unique=True)
    name = models.CharField(max_length=15)
    surname = models.CharField(max_length=30, default="")
    currency = models.CharField(max_length=3, default="EUR")
    profile_picture = models.ImageField(upload_to="profile_pics", null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    access_history = models.ManyToManyField(AccessHistory, related_name="user")

    objects = UserManager()

    USERNAME_FIELD = "email"

    def __str__(self):
        return self.email


class Account(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="accounts")
    name = models.CharField(max_length=100, unique=True)
    type = models.CharField(
        max_length=8, choices=[("bank", "Bank"), ("cash", "Cash"), ("credit", "Credit")], default="bank"
    )
    initial_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    current_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.name} - {self.type}"

    def update_balance(self, type, amount):
        if type == "income":
            self.current_balance += amount
        elif type == "expense":
            self.current_balance -= amount
        self.save(update_fields=["current_balance"])

    def refresh_balance(self):
        income = self.transactions.filter(type="income").aggregate(models.Sum("amount"))["amount__sum"] or 0
        expense = self.transactions.filter(type="expense").aggregate(models.Sum("amount"))["amount__sum"] or 0
        self.current_balance = self.initial_balance + (income - expense)
        self.save(update_fields=["current_balance"])


class Category(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="categories")
    name = models.CharField(max_length=100, unique=True)
    type = models.CharField(max_length=8, choices=[("income", "Income"), ("expense", "Expense")])
    color = models.CharField(max_length=7, default="")
    icon = models.CharField(max_length=150, default="")

    def __str__(self):
        return f"{self.name} - {self.type}"


class CategoryBudget(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="category_budgets")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="category_budgets")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    month = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(12)])
    year = models.IntegerField()

    def __str__(self):
        return f"{self.category.name} - {self.month}/{self.year}"


class RecurringRule(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="recurring_rules")
    frequency = models.CharField(
        max_length=8, choices=[("daily", "Daily"), ("weekly", "Weekly"), ("monthly", "Monthly"), ("yearly", "Yearly")]
    )
    next_date = models.DateField(default=timezone.now)
    end_date = models.DateField(null=True, blank=True)


class Transaction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="transactions")
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="transactions")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="transactions")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(default=timezone.now)
    description = models.CharField(max_length=255)
    type = models.CharField(max_length=8, choices=[("income", "Income"), ("expense", "Expense")])
    is_recurring = models.BooleanField(default=False)
    recurring_rule = models.ForeignKey(
        RecurringRule, on_delete=models.CASCADE, related_name="transactions", null=True, blank=True
    )

    def __str__(self):
        return f"{self.description} - {self.amount}"


class Vault(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="vaults")
    name = models.CharField(max_length=100, unique=True)
    target_amount = models.DecimalField(max_digits=10, decimal_places=2)
    target_date = models.DateField()
    linked_account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="vaults")

    def __str__(self):
        return f"{self.name} - {self.target_amount}"


class VaultContributions(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="vault_contributions")
    vault = models.ForeignKey(Vault, on_delete=models.CASCADE, related_name="vault_contributions")
    source_account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="vault_contributions")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(default=timezone.now)

    def __str__(self):
        return f"{self.vault.name} - {self.amount}"
