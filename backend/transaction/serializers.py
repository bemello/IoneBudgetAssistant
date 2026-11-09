from core.models import BalanceHistory
from rest_framework import serializers

from django.core.exceptions import ObjectDoesNotExist
from core.utils.functions import attempt_json_deserialize
from core.utils.base_serializers import DynamicFieldsModelSerializer
from core.models import Account, Transaction, Category, CategoryBudget, RecurringRule
from user.serializers import UserSerializer

class CustomRelatedField(serializers.RelatedField):
    def to_representation(self, value):
        return {"id": value.id, "name": value.name}

    def to_internal_value(self, data):
        request = self.context.get("request")
        
        try:
            if isinstance(data, int) or (isinstance(data, str) and data.isdigit()):
                return self.queryset.get(pk=data)
            
            if isinstance(data, str):
                return self.queryset.get(name=data, user=request.user)            
            
            raise serializers.ValidationError("Invalid input format.")
            
        except ObjectDoesNotExist:
            raise serializers.ValidationError(f"{self.queryset.model.__name__} not found.")

class CategorySerializer(DynamicFieldsModelSerializer):
    # user = UserSerializer(required=False, fields=["email"])

    class Meta:
        model = Category
        fields = ["id", "user", "name", "icon", "type", "transactions", "category_budgets"]
        read_only_fields = ["user", "transactions", "category_budgets"]
        depth = 2

    # def validate(self, attrs):
    #     """Validate the category"""
    #     user = self.context.get("request").user
    #     name = attrs.get("name")
    #     type = attrs.get("type")

    #     return attrs

    def create(self, validated_data):
        """Create a new category"""
        category = Category.objects.create(**validated_data)
        return category

    def update(self, instance, validated_data):
        """Update a category"""
        instance.name = validated_data.get("name", instance.name)
        instance.type = validated_data.get("type", instance.type)
        instance.icon = validated_data.get("icon", instance.icon)
        instance.save()
        return instance


class CategoryBudgetSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False, fields=["email"])
    # category = CategorySerializer(required=False, fields=["name"])

    class Meta:
        model = CategoryBudget
        fields = ["id", "user", "category", "amount", "month", "year"]
        read_only_fields = ["id", "user"]

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
    # user = UserSerializer(required=False, fields=["email"])

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


class TransactionSerializer(DynamicFieldsModelSerializer):
    user = UserSerializer(required=False, fields=["email", "name"])
    account = CustomRelatedField(queryset=Account.objects.all(), required=True)
    category = CustomRelatedField(queryset=Category.objects.all(), required=True)
    type_display = serializers.CharField(source="get_type_display", required=False)
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
            "type_display",
            "notes",
            "is_recurring",
            "recurring_rule",
        ]
        read_only_fields = ["id", "user", "type_display"]

    def create(self, validated_data):
        """Create a new transaction"""

        if validated_data["is_recurring"] == True:
            request = self.context.get("request")
            recurring_rule = request.data.get("recurring_rule")
            recurring_rule = attempt_json_deserialize(recurring_rule, expect_type=dict)
            recurring_rule_serializer = RecurringRuleSerializer(data=recurring_rule)
            recurring_rule_serializer.is_valid(raise_exception=True)
            recurring_rule_serializer.save(user=request.user)
            validated_data["recurring_rule"] = recurring_rule_serializer.instance

        instance = Transaction.objects.create(**validated_data)
        # instance.account.update_balance(instance)
        instance.account.refresh_balance()

        # balance_history, created = BalanceHistory.objects.get_or_create(
        #     account=instance.account,
        #     date=instance.date,
        #     defaults={"balance": instance.account.current_balance}
        # )
        # if not created:
        #     balance_history.balance = instance.account.current_balance
        #     balance_history.save(update_fields=["balance"])

        return instance

    def update(self, instance, validated_data):
        """Update a transaction"""

        recurring_rule_to_delete = None
        if instance.is_recurring and (validated_data.get("is_recurring") != None and validated_data.get("is_recurring") == False):
            recurring_rule_to_delete = instance.recurring_rule

        recurring_rule = validated_data.pop("recurring_rule", None)
        if recurring_rule is not None:
            if instance.recurring_rule is None:
                instance.recurring_rule = RecurringRule.objects.create(**recurring_rule, user=instance.user)
            recurring_rule_obj = instance.recurring_rule
            recurring_rule_obj.frequency = recurring_rule.get("frequency", recurring_rule_obj.frequency)
            recurring_rule_obj.next_date = recurring_rule.get("next_date", recurring_rule_obj.next_date)
            recurring_rule_obj.end_date = recurring_rule.get("end_date", recurring_rule_obj.end_date)
            recurring_rule_obj.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        if recurring_rule_to_delete:
            recurring_rule_to_delete.delete()
        instance.account.refresh_balance()

        # balance_history, created = BalanceHistory.objects.get_or_create(
        #     account=instance.account,
        #     date=instance.date,
        #     defaults={"balance": instance.account.current_balance}
        # )
        # if not created:
        #     balance_history.balance = instance.account.current_balance
        #     balance_history.save(update_fields=["balance"])
        
        return instance

    def delete(self, instance):
        """Delete a transaction"""
        instance.delete()
        instance.account.refresh_balance()
