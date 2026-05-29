from django.db.models.functions import Coalesce
from drf_spectacular.utils import (
    extend_schema_view,
    extend_schema,
    OpenApiParameter,
    OpenApiTypes,
)
from django.db.models import Q, Sum, Count, DecimalField
from rest_framework import viewsets, mixins, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from core.models import Account
from account.serializers import AccountSerializer


@extend_schema_view(
    list=extend_schema(
        description="List all accounts for the authenticated user",
        parameters=[
            OpenApiParameter(
                "type",
                OpenApiTypes.STR,
                required=False,
                description="Filter by account type (e.g., 'bank', 'credit', 'cash')",
            ),
            OpenApiParameter(
                "name",
                OpenApiTypes.STR,
                required=False,
                description="Filter by account name",
            ),
        ],
    ),
    create=extend_schema(
        description="Create a new account for the authenticated user",
    ),
    retrieve=extend_schema(
        description="Retrieve an account by ID",
    ),
    update=extend_schema(
        description="Update an account by ID",
    ),
    partial_update=extend_schema(
        description="Partially update an account by ID",
    ),
    destroy=extend_schema(
        description="Delete an account by ID",
    ),
)
class AccountViewSet(viewsets.ModelViewSet):
    """Viewset for managing user accounts"""

    serializer_class = AccountSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Account.objects.all()

    def validate(self, attrs):
        """Validate the account data"""
        print("Validating account data")
        user = self.request.user
        name = attrs.get("name")
        type = attrs.get("type")
        initial_balance = attrs.get("initial_balance")
        current_balance = attrs.get("current_balance")

        if Account.objects.filter(user=user, name=name).exists():
            raise serializers.ValidationError("Account with this name already exists")
        if initial_balance != current_balance:
            raise serializers.ValidationError("Initial balance must equal current balance")
        return attrs

    def perform_create(self, serializer):
        """Set the user for the new account"""
        serializer.save(user=self.request.user)

    def get_queryset(self):
        """Get accounts for the authenticated user"""
        queryset = super().get_queryset().filter(user=self.request.user)
        account_type = self.request.query_params.get("type", None)
        name = self.request.query_params.get("name", None)
        if account_type:
            queryset = queryset.filter(type=account_type)
        if name:
            queryset = queryset.filter(name=name)
        return queryset

    @extend_schema(
        description="Get account statistics",
        parameters=[
            OpenApiParameter(
                "account_type",
                OpenApiTypes.STR,
                required=False,
                description="Filter by account type",
            ),
        ],
    )
    @action(detail=False, methods=["get"], url_path="stats")
    def stats(self, request):
        """Get account statistics including total balance and transaction counts"""
        queryset = Account.objects.filter(user=request.user)

        # Apply filters from query parameters
        account_type = request.query_params.get("account_type", None)
        if account_type:
            queryset = queryset.filter(type=account_type)

        # Calculate statistics
        stats = queryset.aggregate(
            total_accounts=Count("id"),
            total_balance=Sum("current_balance"),
            total_transactions=Count("transactions"),
            total_expenses=Coalesce(
                Sum("transactions__amount", filter=Q(transactions__type="expense")), 0.0, output_field=DecimalField()
            ),
            total_income=Coalesce(
                Sum("transactions__amount", filter=Q(transactions__type="income")), 0.0, output_field=DecimalField()
            ),
        )

        # Get breakdown by account type
        type_breakdown = (
            queryset.values("type")
            .annotate(
                count=Count("id"),
                total_balance=Sum("current_balance"),
                total_transactions=Count("transactions"),
                total_expenses=Coalesce(
                    Sum("transactions__amount", filter=Q(transactions__type="expense")),
                    0.0,
                    output_field=DecimalField(),
                ),
                total_income=Coalesce(
                    Sum("transactions__amount", filter=Q(transactions__type="income")), 0.0, output_field=DecimalField()
                ),
            )
            .order_by("-total_balance")
        )

        return Response(
            {
                "total_accounts": stats["total_accounts"] or 0,
                "total_balance": stats["total_balance"] or 0,
                "total_transactions": stats["total_transactions"] or 0,
                "total_expenses": stats["total_expenses"] or 0,
                "total_income": stats["total_income"] or 0,
                "breakdown_by_type": type_breakdown,
            }
        )

    @action(detail=True, methods=["patch"], url_path="refresh-balance")
    def refresh_account_balance(self, request, pk):
        """Refresh the balance of an account"""
        queryset = Account.objects.filter(user=request.user)
        account = queryset.get(pk=pk)
        account.refresh_balance()
        return Response(AccountSerializer(account).data)
