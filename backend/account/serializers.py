from rest_framework import serializers
from core.models import Account
from core.utils.base_serializers import DynamicFieldsModelSerializer
from user.serializers import UserSerializer


class AccountSerializer(DynamicFieldsModelSerializer):
    user = UserSerializer(required=False, fields=["email", "name", "surname"])

    class Meta:
        model = Account
        fields = [
            "id",
            "user",
            "name",
            "type",
            "initial_balance",
            "current_balance",
            "transactions",
            "vault_contributions",
        ]
        read_only_fields = ["id", "user", "transactions", "vault_contributions"]

    def validate(self, attrs):
        """Validate the account data"""
        user = self.context.get("request").user
        name = attrs.get("name")
        type = attrs.get("type")
        initial_balance = attrs.get("initial_balance")
        current_balance = attrs.get("current_balance")

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
