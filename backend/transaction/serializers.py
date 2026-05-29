from rest_framework import serializers

from core.utils.functions import attempt_json_deserialize
from core.utils.base_serializers import DynamicFieldsModelSerializer
from core.models import Account, Transaction, Category, CategoryBudget, RecurringRule
from user.serializers import UserSerializer


class CategorySerializer(DynamicFieldsModelSerializer):
    user = UserSerializer(required=False, fields=["email", "name", "surname"])

    class Meta:
        model = Category
        fields = ["id", "user", "name", "type"]
        read_only_fields = ["user"]

    def validate(self, attrs):
        """Validate the category"""
        user = self.context.get("request").user
        name = attrs.get("name")
        type = attrs.get("type")

        return attrs

    def create(self, validated_data):
        """Create a new category"""
        category = Category.objects.create(**validated_data)
        return category

    def update(self, instance, validated_data):
        """Update a category"""
        instance.name = validated_data.get("name", instance.name)
        instance.type = validated_data.get("type", instance.type)
        instance.save()
        return instance


class CategoryBudgetSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False, fields=["email", "name", "surname"])
    category = CategorySerializer(required=False, fields=["id", "name"])

    class Meta:
        model = CategoryBudget
        fields = ["id", "user", "category", "amount", "month", "year"]
        read_only_fields = ["id", "user", "category"]

    def create(self, validated_data):
        """Create a new category budget"""
        category_budget = CategoryBudget.objects.create(**validated_data)
        return category_budget

    def update(self, instance, validated_data):
        """Update a category budget"""
        instance.category = validated_data.get("category", instance.category)
        instance.amount = validated_data.get("amount", instance.amount)
        instance.month = validated_data.get("month", instance.month)
        instance.year = validated_data.get("year", instance.year)
        instance.save()
        return instance


class RecurringRuleSerializer(DynamicFieldsModelSerializer):
    user = UserSerializer(required=False, fields=["email", "name", "surname"])

    class Meta:
        model = RecurringRule
        fields = ["id", "user", "frequency", "next_date", "end_date"]
        read_only_fields = ["id", "user"]

    def create(self, validated_data):
        """Create a new recurring rule"""
        recurring_rule = RecurringRule.objects.create(**validated_data)
        return recurring_rule

    def update(self, instance, validated_data):
        """Update a recurring rule"""
        instance.frequency = validated_data.get("frequency", instance.frequency)
        instance.next_date = validated_data.get("next_date", instance.next_date)
        instance.end_date = validated_data.get("end_date", instance.end_date)
        instance.save()
        return instance


class TransactionSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False, fields=["email", "name", "surname"])
    account = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all(), required=True)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=True)
    recurring_rule = RecurringRuleSerializer(required=False, fields=["id", "frequency", "next_date", "end_date"])

    class Meta:
        model = Transaction
        fields = [
            "id",
            "user",
            "account",
            "category",
            "amount",
            "date",
            "description",
            "type",
            "is_recurring",
            "recurring_rule",
        ]
        read_only_fields = ["id", "user"]

    def create(self, validated_data):
        """Create a new transaction"""

        if validated_data["is_recurring"] == True:
            request = self.context.get("request")
            recurring_rule = request.data.get("recurring_rule")
            recurring_rule = attempt_json_deserialize(recurring_rule, expect_type=dict)
            recurring_rule_serializer = RecurringRuleSerializer(data=recurring_rule)
            recurring_rule_serializer.is_valid(raise_exception=True)
            recurring_rule_serializer.save(user=request.user)
            validated_data["recurring_rule_id"] = recurring_rule_serializer.data["id"]

        instance = Transaction.objects.create(**validated_data)
        instance.account.update_balance(instance.type, instance.amount)

        return instance

    def update(self, instance, validated_data):
        """Update a transaction"""

        if instance.is_recurring and not validated_data.get("is_recurring"):
            instance.recurring_rule.delete()

        recurring_rule = validated_data.pop("recurring_rule", None)
        if recurring_rule is not None:
            recurring_rule_obj = instance.recurring_rule
            recurring_rule_obj.frequency = recurring_rule.get("frequency", recurring_rule_obj.frequency)
            recurring_rule_obj.next_date = recurring_rule.get("next_date", recurring_rule_obj.next_date)
            recurring_rule_obj.end_date = recurring_rule.get("end_date", recurring_rule_obj.end_date)
            recurring_rule_obj.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        instance.account.refresh_balance()
        return instance

    def delete(self, instance):
        """Delete a transaction"""
        instance.delete()
        instance.account.refresh_balance()
