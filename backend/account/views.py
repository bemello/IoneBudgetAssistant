from datetime import date
from drf_spectacular.utils import (
    extend_schema_view,
    extend_schema,
    OpenApiParameter,
    OpenApiTypes,
)
from django.db.models import Q, Sum, Count, DecimalField, DateField, CharField, IntegerField
from django.db.models.functions import Coalesce, TruncMonth, TruncYear, Cast, Substr
from rest_framework import viewsets, mixins, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from core.models import Account, BalanceHistory
from account.serializers import AccountSerializer, BalanceHistorySerializer


@extend_schema_view(
    list=extend_schema(
        description="List all accounts for the authenticated user",
        parameters=[
            OpenApiParameter(
                "type",
                OpenApiTypes.STR,
                required=False,
                description="Filter by account type (e.g., 'bank', 'cash')",
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
            OpenApiParameter(
                "month",
                OpenApiTypes.INT,
                required=False,
                description="Filter by a specific month",
            ),
            OpenApiParameter(
                "year",
                OpenApiTypes.INT,
                required=False,
                description="Filter by a specific year",
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
            total_accounts=Count("id", distinct=True),
            total_balance=Sum("current_balance", distinct=True),
            total_transactions=Count("transactions", distinct=True),
            total_expenses=Coalesce(
                Sum("transactions__amount", filter=Q(transactions__type="expense")), 0.0, output_field=DecimalField()
            ),
            total_income=Coalesce(
                Sum("transactions__amount", filter=Q(transactions__type="income")), 0.0, output_field=DecimalField()
            ),
            total_vault_contributions=Coalesce(
                Sum("transactions__amount", filter=Q(transactions__type="vault_contribution")), 0.0, output_field=DecimalField()
            ),
            current_month_income=Coalesce(
                Sum("transactions__amount", 
                    filter=Q(transactions__type="income", 
                        transactions__date__month=date.today().month, 
                        transactions__date__year=date.today().year)), 0.0, output_field=DecimalField()
            ),
            current_month_expense=Coalesce(
                Sum("transactions__amount", 
                    filter=Q(transactions__type="expense", 
                        transactions__date__month=date.today().month, 
                        transactions__date__year=date.today().year)), 0.0, output_field=DecimalField()
            ),
            previous_month_income=Coalesce(
                Sum("transactions__amount", 
                    filter=Q(transactions__type="income", 
                        transactions__date__month=date.today().month-1, 
                        transactions__date__year=date.today().year)), 0.0, output_field=DecimalField()
            ),
            previous_month_expense=Coalesce(
                Sum("transactions__amount", 
                    filter=Q(transactions__type="expense", 
                        transactions__date__month=date.today().month-1, 
                        transactions__date__year=date.today().year)), 0.0, output_field=DecimalField()
            ),
        )

        # Get breakdown by account type
        type_breakdown = (
            queryset.values("type")
            .annotate(
                count=Count("id", distinct=True),
                total_balance=Sum("current_balance", distinct=True),
                total_transactions=Count("transactions", distinct=True),
                total_expenses=Coalesce(
                    Sum("transactions__amount", filter=Q(transactions__type="expense")),
                    0.0,
                    output_field=DecimalField(),
                ),
                total_income=Coalesce(
                    Sum("transactions__amount", filter=Q(transactions__type="income")), 0.0, output_field=DecimalField()
                ),
                total_vault_contributions=Coalesce(
                    Sum("transactions__amount", filter=Q(transactions__type="vault_contribution")), 0.0, output_field=DecimalField()
                ),
            )
            .order_by("-total_balance")
        )

        # Get monthly breakdown
        month_sql = Cast(
            Substr(
                Cast(TruncMonth("transactions__date", output_field=DateField()),output_field=CharField()), 
                6, 2), 
            output_field=IntegerField())
        year_sql = Cast(
            Substr(
                Cast(TruncYear("transactions__date", output_field=DateField()),output_field=CharField()), 
                1, 4), 
            output_field=IntegerField())
        monthly_breakdown = (
            queryset.filter(transactions__isnull=False)
            .annotate(month=month_sql, year=year_sql)
            .values("year", "month")
            .annotate(
                total_transactions=Count("transactions__id", distinct=True),
                total_expenses=Coalesce(
                    Sum(
                        "transactions__amount",
                        filter=Q(transactions__type="expense"),
                    ),
                    0.0,
                    output_field=DecimalField(),
                ),
                total_income=Coalesce(
                    Sum(
                        "transactions__amount",
                        filter=Q(transactions__type="income"),
                    ),
                    0.0,
                    output_field=DecimalField(),
                ),
                total_vault_contributions=Coalesce(
                    Sum(
                        "transactions__amount",
                        filter=Q(transactions__type="vault_contribution"),
                    ),
                    0.0,
                    output_field=DecimalField(),
                ),
            )
            .order_by("-year", "-month")
    )

        return Response(
            {
                "total_accounts": stats["total_accounts"] or 0,
                "total_balance": stats["total_balance"] or 0,
                "total_transactions": stats["total_transactions"] or 0,
                "total_income": stats["total_income"] or 0,
                "total_expenses": stats["total_expenses"] or 0,
                "total_vault_contributions": stats["total_vault_contributions"] or 0,
                "current_month_income": stats["current_month_income"] or 0,
                "current_month_expense": stats["current_month_expense"] or 0,
                "previous_month_income": stats["previous_month_income"] or 0,
                "previous_month_expense": stats["previous_month_expense"] or 0,
                "breakdown_by_type": type_breakdown,
                "breakdown_by_month": monthly_breakdown,
            }
        )

    @action(detail=True, methods=["patch"], url_path="refresh-balance")
    def refresh_account_balance(self, request, pk):
        """Refresh the balance of an account"""
        queryset = Account.objects.filter(user=request.user)
        account = queryset.get(pk=pk)
        account.refresh_balance()
        return Response(AccountSerializer(account).data)

    @extend_schema(
        description="Get account balance history",
        parameters=[
            OpenApiParameter(
                "account_id",
                OpenApiTypes.INT,
                required=False,
                description="Filter by account id",
            ),
            OpenApiParameter(
                "month",
                OpenApiTypes.INT,
                required=False,
                description="Filter by month",
            ),
            OpenApiParameter(
                "year",
                OpenApiTypes.INT,
                required=False,
                description="Filter by year",
            ),
            OpenApiParameter(
                "date_range_start",
                OpenApiTypes.DATE,
                description="Filter by date range (start)",
            ),
            OpenApiParameter(
                "date_range_end",
                OpenApiTypes.DATE,
                description="Filter by date range (end)",
            )
        ],
    )
    @action(detail=False, methods=["get"], url_path="balance-history")
    def balance_history(self, request):
        """Get balance history of all user accounts"""
        accounts = Account.objects.filter(user=request.user)
        for account in accounts:
            account.update_balance_history()
        balance_history = BalanceHistory.objects.filter(account__in=accounts).order_by("date")

        account_id = request.query_params.get("account_id", None)
        month = request.query_params.get("month", None)
        year = request.query_params.get("year", None)
        date_range_start = request.query_params.get("date_range_start", None)
        date_range_end = request.query_params.get("date_range_end", None)

        if month and year:
            balance_history = balance_history.filter(date__month=month, date__year=year)
        if date_range_start and date_range_end:
            balance_history = balance_history.filter(date__range=(date.fromisoformat(date_range_start), date.fromisoformat(date_range_end)))

        if account_id:
            balance_history = balance_history.filter(account__id=account_id)
        else:
            balance_history = balance_history.values("date").annotate(
                balance=Sum("balance"),
                balance_day_before=Sum("balance_day_before"),
            )


        return Response(BalanceHistorySerializer(balance_history, many=True).data)