from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework import serializers

from core.utils.functions import attempt_json_deserialize
from core.utils.base_serializers import DynamicFieldsModelSerializer
from core.models import Vault, VaultContributions, Account
from user.serializers import UserSerializer


class VaultSerializer(DynamicFieldsModelSerializer):
    user = UserSerializer(required=False, fields=["email", "name", "surname"])
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
    user = UserSerializer(required=False, fields=["email", "name", "surname"])
    vault = PrimaryKeyRelatedField(queryset=Vault.objects.all(), required=False)
    source_account = PrimaryKeyRelatedField(queryset=Account.objects.all(), required=True)

    class Meta:
        model = VaultContributions
        fields = ["id", "user", "vault", "source_account", "amount", "date"]
        read_only_fields = ["id", "user", "vault"]

    def create(self, validated_data):
        """Create a new vault contribution"""

        vault_contribution = VaultContributions.objects.create(**validated_data)
        vault_contribution.source_account.update_balance("expense", vault_contribution.amount)
        return vault_contribution

    def update(self, instance, validated_data):
        """Update an existing vault contribution"""

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        instance.source_account.refresh_balance()
        return instance
