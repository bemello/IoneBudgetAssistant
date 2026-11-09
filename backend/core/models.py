import uuid
import os

from django.utils import timezone
from datetime import date
from dateutil.rrule import rrule, DAILY
from django.core.validators import MinValueValidator, MaxValueValidator
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


class Currencies(models.TextChoices):
    US_DOLLAR = "USD"
    BRITISH_POUND = "GBP"
    EURO = "EUR"
    SWISS_FRANC = "CHF"
    BRAZILIAN_REAL = "BRL"
    JAPANESE_YEN = "JPY"
    CHINESE_YUAN = "CNY"
    INDIAN_RUPEE = "INR"
    CANADIAN_DOLLAR = "CAD"
    AUSTRALIAN_DOLLAR = "AUD"
    RUSSIAN_RUBEL = "RUB"


class User(AbstractBaseUser, PermissionsMixin):
    """
    Docstring for User
    Custom User
    """

    email = models.EmailField(max_length=30, unique=True)
    name = models.CharField(max_length=15)
    surname = models.CharField(max_length=30, default="")
    starting_date = models.DateField(default=timezone.now)
    currency = models.CharField(max_length=3, choices=Currencies, default=Currencies.EURO)
    profile_picture = models.ImageField(upload_to="profile_pics", null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    access_history = models.ManyToManyField(AccessHistory, related_name="user")

    objects = UserManager()

    USERNAME_FIELD = "email"

    def __str__(self):
        return self.email


class Account(models.Model):
    BANK = "bank"
    CASH = "cash"
    ACCOUNT_TYPES = [
        (BANK, "Bank Account"),
        (CASH, "Cash"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="accounts")
    name = models.CharField(max_length=100)
    type = models.CharField(
        max_length=10, choices=ACCOUNT_TYPES, default=BANK
    )
    initial_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    current_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    icon = models.CharField(max_length=150, default="")
    currency = models.CharField(max_length=3, choices=Currencies, default=Currencies.EURO)

    class Meta:
        unique_together = ["user", "name"]
        ordering = ["id", "name"]

    def __str__(self):
        return f"{self.name} - {self.type}"
  
    def get_type(self):
        return self.get_type_display()      

    def get_daily_transactions(self, initial_date = None):
        transactions = self.transactions

        if initial_date is not None:
            transactions = transactions.filter(date__gte=initial_date)

        daily_transactions = transactions.values("date", "type").annotate(
            total_amount=models.Sum("amount")).order_by("date")
        return daily_transactions

    # def update_balance(self, transaction):
    #     if transaction.type == "income":
    #         self.current_balance += transaction.amount
    #     elif transaction.type == "expense":
    #         self.current_balance -= transaction.amount
    #     elif transaction.type == "vault_contribution":
    #         self.current_balance -= transaction.amount
    #     self.save(update_fields=["current_balance"])

    def refresh_balance(self, initial_date = None):
        transactions = self.transactions
        previous_balance = 0
        balance = self.initial_balance

        if initial_date is not None:
            transactions = transactions.filter(date__gte=initial_date)
            previous_balance_history = BalanceHistory.objects.get(account=self, date=initial_date)
            if previous_balance_history is not None:
                previous_balance = previous_balance_history.balance

        total_income = transactions.filter(type="income").aggregate(models.Sum("amount"))["amount__sum"] or 0
        total_expense = transactions.filter(type="expense").aggregate(models.Sum("amount"))["amount__sum"] or 0
        total_vault_contribution = transactions.filter(type="vault_contribution").aggregate(models.Sum("amount"))["amount__sum"] or 0
        self.current_balance = self.initial_balance + (total_income - total_expense - total_vault_contribution)
        self.save(update_fields=["current_balance"])

        daily_transactions = self.get_daily_transactions(initial_date)

        for daily_transaction in daily_transactions:
            if daily_transaction["type"] == "income":
                balance += daily_transaction["total_amount"]
            elif daily_transaction["type"] in ("expense", "vault_contribution"):
                balance -= daily_transaction["total_amount"]
            if self.user.starting_date == daily_transaction["date"]:
                previous_balance = None

            balance_history, created = BalanceHistory.objects.get_or_create(account=self, date=daily_transaction["date"], defaults={"balance": balance, "balance_day_before": previous_balance})
            if not created:
                balance_history.balance = balance
                balance_history.balance_day_before = previous_balance
                balance_history.save(update_fields=["balance", "balance_day_before"])

            previous_balance = balance
    
    def update_balance_history(self):
        self.refresh_balance()
        start_date = self.user.starting_date
        end_date = date.today()
        current_balance = self.initial_balance
        previous_balance = 0

        for d in rrule(DAILY, dtstart=start_date, until=end_date):
            balance_history, created = BalanceHistory.objects.get_or_create(account=self, date=d, defaults={"balance": current_balance, "balance_day_before": previous_balance})
            if not created:
                balance_history.balance_day_before = previous_balance
                balance_history.save(update_fields=["balance_day_before"])
            current_balance = balance_history.balance
            previous_balance = balance_history.balance

            

class BalanceHistory(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="balance_histories")
    date = models.DateField(default=date.today)
    balance = models.DecimalField(max_digits=10, decimal_places=2)
    balance_day_before = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    class Meta:
        unique_together = ["account", "date"]

    def __str__(self):
        return f"{self.account.name} - {self.date} : {self.balance}"

    def user(self):
        return self.account.user


class Category(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="categories")
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=8, choices=[("expense", "Expense"), ("income", "Income")], default="expense")
    icon = models.CharField(max_length=150, default="")

    class Meta:
        unique_together = ["user", "name"]

    def __str__(self):
        return f"{self.name} - {self.type}"


class CategoryBudget(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="category_budgets")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="category_budgets")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    month = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(12)])
    year = models.IntegerField()

    class Meta:
        ordering = ["-year", "-month"]

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

    INCOME = "income"
    EXPENSE = "expense"
    VAULT_CONTRIBUTION = "vault_contribution"
    TRANSACTION_TYPES = [
        (INCOME, "Income"),
        (EXPENSE, "Expense"),
        (VAULT_CONTRIBUTION, "Vault"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="transactions")
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="transactions")
    category = models.ForeignKey(Category, models.SET_NULL, related_name="transactions", null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(default=timezone.now)
    description = models.CharField(max_length=255)
    notes = models.CharField(max_length=1000, null=True, blank=True)
    type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    is_recurring = models.BooleanField(default=False)
    recurring_rule = models.ForeignKey(
        RecurringRule, models.SET_NULL, related_name="transactions", null=True, blank=True
    )

    class Meta:
        ordering = ["account", "-date"]

    def __str__(self):
        return f"{self.description}: {self.amount}"

    def get_type(self):
        return self.get_type_display()


class Vault(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="vaults")
    name = models.CharField(max_length=100)
    target_amount = models.DecimalField(max_digits=10, decimal_places=2)
    target_date = models.DateField()
    linked_account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="vaults")

    class Meta:
        unique_together = ["user", "name"]

    def __str__(self):
        return f"{self.name} - {self.target_amount}"


class VaultContributions(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="vault_contributions")
    vault = models.ForeignKey(Vault, on_delete=models.CASCADE, related_name="vault_contributions")
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="vault_contributions")
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE, related_name="vault_contributions")

    def __str__(self):
        return f"{self.vault.name} - {self.transaction.amount}"


class Investment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="investments")
    name = models.CharField(max_length=100, blank=False)
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.name} - {self.investment_amount} ({self.date})"
    
    
class Stock(Investment):
    symbol = models.CharField(max_length=10, blank=False)
    quantity = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    logo = models.ImageField(upload_to="investments/logos", null=True, blank=True)

    def __str__(self):
        return f"{self.symbol} - {self.quantity} ({self.date})"
    
class Crypto(Investment):
    coinmarketcap_id = models.IntegerField(null=True, blank=True)
    symbol = models.CharField(max_length=10, blank=False)
    slug = models.CharField(max_length=20, blank=False)
    quantity = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    logo = models.ImageField(upload_to="investments/logos", null=True, blank=True)

    def __str__(self):
        return f"{self.symbol} - {self.quantity} ({self.date})"

class RealEstate(Investment):
    type = models.CharField(max_length=20, choices=[("apartment", "Apartment"), ("house", "House"), ("commercial", "Commercial"), ("land", "Land")])
    price = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.type} - {self.price} ({self.date})"

    
