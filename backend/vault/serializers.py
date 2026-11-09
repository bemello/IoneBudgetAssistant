from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework import serializers

from core.utils.functions import attempt_json_deserialize
from core.utils.base_serializers import DynamicFieldsModelSerializer
from core.models import Vault, VaultContributions, Account, Transaction
from user.serializers import UserSerializer
from transaction.serializers import TransactionSerializer


class VaultSerializer(DynamicFieldsModelSerializer):
    # user = UserSerializer(required=False, fields=["email", "name", "surname"])
    linked_account = PrimaryKeyRelatedField(queryset=Account.objects.all(), required=True)

    class Meta:
        model = Vault
        fields = ["id", "user", "name", "target_amount", "target_date", "linked_account", "vault_contributions"]
        read_only_fields = ["id", "user", "vault_contributions"]

    def create(self, validated_data):
        """Create a new vault"""
        request = self.context.get("request")

        vault = Vault.objects.create(**validated_data)
        return vault

    def update(self, instance, validated_data):
        """Update an existing vault"""

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class VaultContributionsSerializer(DynamicFieldsModelSerializer):
    # user = UserSerializer(required=False, fields=["email", "name", "surname"])
    vault = PrimaryKeyRelatedField(queryset=Vault.objects.all(), required=False)
    account = PrimaryKeyRelatedField(queryset=Account.objects.all(), required=True)
    # transaction = TransactionSerializer(required=False, fields=["id", "amount", "date"])

    class Meta:
        model = VaultContributions
        fields = ["id", "user", "vault", "account", "transaction"]
        read_only_fields = ["id", "user", "vault"]

    def create(self, validated_data):
        """Create a new vault contribution"""
        request = self.context.get("request")
        transaction = request.data.get("transaction")
        transaction = attempt_json_deserialize(transaction, expect_type=dict)
        transaction["account"] = validated_data.get("account").id
        transaction["description"] = "Vault " + validated_data["vault"].name + "contribution"
        transaction["type"] = "vault_contribution"
        transaction["is_recurring"] = False
        transactionSerializer = TransactionSerializer(data=transaction)
        transactionSerializer.is_valid(raise_exception=True)
        transactionSerializer.save(user=request.user)
        validated_data["transaction"] = transactionSerializer.instance

        vault_contribution = VaultContributions.objects.create(**validated_data)
        vault_contribution.account.update_balance("expense", vault_contribution.transaction.amount)
        return vault_contribution

    def update(self, instance, validated_data):
        """Update an existing vault contribution"""

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        instance.account.refresh_balance()
        return instance
