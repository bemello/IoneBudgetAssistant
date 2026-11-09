from rest_framework import serializers
from core.models import Account, BalanceHistory
from core.utils.base_serializers import DynamicFieldsModelSerializer
from user.serializers import UserSerializer
from transaction.serializers import TransactionSerializer


class AccountSerializer(DynamicFieldsModelSerializer):
    # user = UserSerializer(required=False, fields=["email", "name", "surname"])
    type_display = serializers.CharField(source="get_type_display", required=False)
    transactions = TransactionSerializer(many=True, required=False, fields=["id", "description", "category", "type", "type_display", "amount", "date", "notes"])

    class Meta:
        model = Account
        fields = [
            "id",
            "user",
            "name",
            "type",
            "type_display",
            "initial_balance",
            "current_balance",
            "transactions",
            "vault_contributions",
            "icon",
            "currency",
        ]
        read_only_fields = ["id", "user", "transactions", "vault_contributions", "type_display"]
        # depth = 1

    def validate(self, attrs):
        """Validate the account data"""
        user = self.context.get("request").user
        name = attrs.get("name")

        if Account.objects.filter(user=user, name=name).exists():
            raise serializers.ValidationError("Account with this name already exists")

        return attrs

    def create(self, validated_data):
        """Create a new account"""
        account, created = Account.objects.get_or_create(**validated_data)
        return account

    def update(self, instance, validated_data):
        """Update an account"""
        instance.name = validated_data.get("name", instance.name)
        instance.type = validated_data.get("type", instance.type)
        instance.initial_balance = validated_data.get("initial_balance", instance.initial_balance)
        instance.current_balance = validated_data.get("current_balance", instance.current_balance)
        instance.save()
        return instance

class BalanceHistorySerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = BalanceHistory
        fields = [
            "id",
            "account",
            "date",
            "balance",
            "balance_day_before",
        ]
        read_only_fields = ["id", "account", "balance", "balance_day_before", "date"]

    def validate(self, attrs):
        """Validate the balance history data"""
        user = self.context.get("request").user
        account = attrs.get("account")
        balance = attrs.get("balance")
        balance_day_before = attrs.get("balance_day_before")
        date = attrs.get("date")

        return attrs

    def create(self, validated_data):
        """Create a new balance history"""
        balance_history, created = BalanceHistory.objects.get_or_create(**validated_data)
        return balance_history

    def update(self, instance, validated_data):
        """Update a balance history"""
        instance.balance = validated_data.get("balance", instance.balance)
        instance.save()
        return instance