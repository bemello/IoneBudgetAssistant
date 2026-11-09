from datetime import date
from drf_spectacular.utils import (
    extend_schema_view,
    extend_schema,
    OpenApiParameter,
    OpenApiTypes,
)
from django.db.models import Q, Sum, Count, DecimalField, DateField, CharField, IntegerField, Min, Max, Avg, Prefetch
from django.db.models.functions import Coalesce, TruncMonth, TruncYear, Cast, Substr
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.models import Transaction, Category, CategoryBudget
from transaction.serializers import TransactionSerializer, CategorySerializer, CategoryBudgetSerializer


@extend_schema_view(
    list=extend_schema(
        description="List all transactions for the authenticated user",
        parameters=[
            OpenApiParameter(
                "account",
                type=OpenApiTypes.INT,
                description="Filter by account ID",
                required=False,
            ),
            OpenApiParameter(
                "category",
                type=OpenApiTypes.INT,
                description="Filter by category ID",
                required=False,
            ),
            OpenApiParameter(
                "type",
                type=OpenApiTypes.STR,
                description="Filter by transaction type",
                required=False,
            ),
            OpenApiParameter(
                "date",
                type=OpenApiTypes.DATE,
                description="Filter by date",
                required=False,
            ),
            OpenApiParameter(
                "is_recurring",
                type=OpenApiTypes.BOOL,
                description="Filter by recurring status",
                required=False,
            ),
            OpenApiParameter(
                "limit",
                type=OpenApiTypes.BOOL,
                description="Limit to 5 the number of transactions returned",
                required=False,
            ),
        ],
    ),
    create=extend_schema(
        description="Create a new transaction",
    ),
    retrieve=extend_schema(
        description="Get a transaction by ID",
    ),
    update=extend_schema(
        description="Update a transaction by ID",
    ),
    partial_update=extend_schema(
        description="Partially update a transaction by ID",
    ),
    destroy=extend_schema(
        description="Delete a transaction by ID",
    ),
)
class TransactionViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    queryset = Transaction.objects.all()

    def get_queryset(self):
        """Get transactions for the authenticated user"""
        queryset = super().get_queryset().filter(user=self.request.user)
        account = self.request.query_params.get("account", None)
        category = self.request.query_params.get("category", None)
        type = self.request.query_params.get("type", None)
        date = self.request.query_params.get("date", None)
        is_recurring = self.request.query_params.get("is_recurring", None)
        limit = self.request.query_params.get("limit", False)
        if account:
            queryset = queryset.filter(account=account)
        if category:
            queryset = queryset.filter(category=category)
        if type:
            queryset = queryset.filter(type=type)
        if date:
            queryset = queryset.filter(date=date)
        if is_recurring:
            queryset = queryset.filter(is_recurring=is_recurring)

        queryset = queryset.order_by("-date")

        if limit:
            queryset = queryset[:5]

        return queryset

    @extend_schema(
        description="Get transactions by recurrence",
        parameters=[
            OpenApiParameter(
                "recurrence",
                type=OpenApiTypes.STR,
                description="Filter by recurrence (e.g., 'daily', 'weekly', 'monthly', 'yearly')",
                required=True,
            ),
        ],
    )
    @action(detail=False, methods=["get"], url_path="recurrence")
    def get_transaction_by_recurrence(self):
        recurrence = self.request.query_params.get("recurrence", None)
        if recurrence == "daily":
            return self.queryset.filter(recurring_rule__frequency="daily")
        elif recurrence == "weekly":
            return self.queryset.filter(recurring_rule__frequency="weekly")
        elif recurrence == "monthly":
            return self.queryset.filter(recurring_rule__frequency="monthly")
        elif recurrence == "yearly":
            return self.queryset.filter(recurring_rule__frequency="yearly")
        else:
            return self.queryset

    def perform_create(self, serializer):
        """Set the user for the new transaction"""
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """Update a transaction"""
        serializer.save(user=self.request.user)


@extend_schema_view(
    list=extend_schema(
        description="List all categories for the authenticated user",
        parameters=[
            OpenApiParameter(
                "name",
                type=OpenApiTypes.STR,
                description="Filter by category name",
                required=False,
            ),
            OpenApiParameter(
                "only_expenses",
                type=OpenApiTypes.BOOL,
                description="Show only expenses",
                required=False,
            ),
            OpenApiParameter(
                "start_date",
                type=OpenApiTypes.DATE,
                description="Start of date range",
                required=False,
            ),
            OpenApiParameter(
                "end_date",
                type=OpenApiTypes.DATE,
                description="End of date range",
                required=False,
            ),
        ],
    ),
    create=extend_schema(
        description="Create a new category for the authenticated user",
    ),
    retrieve=extend_schema(
        description="Get a category by ID",
    ),
    update=extend_schema(
        description="Update a category by ID",
    ),
    partial_update=extend_schema(
        description="Partially update a category by ID",
    ),
    destroy=extend_schema(
        description="Delete a category by ID",
    ),
)
class CategoryViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer
    queryset = Category.objects.all()

    def get_queryset(self):
        """Get categories for the authenticated user"""
        queryset = super().get_queryset().filter(user=self.request.user)
        name = self.request.query_params.get("name", None)
        only_expenses = self.request.query_params.get("only_expenses", None)
        start_date = self.request.query_params.get("start_date", None)
        end_date = self.request.query_params.get("end_date", None)

        if name:
            queryset = queryset.filter(name=name)
        if only_expenses:
            queryset = queryset.filter(type="expense")
        if start_date and end_date:
            queryset = queryset.prefetch_related(
                Prefetch("transactions", 
                    queryset=Transaction.objects.filter(
                        date__range=(start_date, end_date)
                    )
                )
            )

        return queryset.order_by("name").distinct()

    def perform_create(self, serializer):
        """Set the user for the new category"""
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """Update a category"""
        serializer.save(user=self.request.user)

    @extend_schema(
        description="Get categories statistics",
        parameters=[
            OpenApiParameter(
                "name",
                type=OpenApiTypes.STR,
                description="Filter by category name",
                required=False,
            ),
            OpenApiParameter(
                "only_expenses",
                type=OpenApiTypes.BOOL,
                description="Show only expenses",
                required=False,
            ),
        ],
    )
    @action(detail=False, methods=["get"], url_path="stats")
    def stats(self, request):
        """Get categories statistics including total spending and budget limit"""
        queryset = Category.objects.filter(user=request.user).order_by("name")
        name = self.request.query_params.get("name", None)
        only_expenses = self.request.query_params.get("only_expenses", False)

        if name:
            queryset = queryset.filter(name=name)
        if only_expenses:
            queryset = queryset.filter(type="expense")
  
        category_breakdown = (
            queryset
            .values("id", "name", "icon")
            .annotate(
                total_transactions=Count("transactions__id", filter=Q(transactions__isnull=True) | (Q(transactions__date__month = date.today().month) & Q(transactions__date__year = date.today().year))),
                total_expenses=Coalesce(
                    Sum("transactions__amount", filter=Q(transactions__type="expense") & (Q(transactions__date__month = date.today().month) & Q(transactions__date__year = date.today().year))),
                    0.0,
                    output_field=DecimalField(),
                ),
                average_expense=Coalesce(
                    Avg("transactions__amount", filter=Q(transactions__type="expense") & (Q(transactions__date__month = date.today().month) & Q(transactions__date__year = date.today().year))),
                    0.0,
                    output_field=DecimalField(),
                ),
                lowest_expense=Coalesce(
                    Min("transactions__amount", filter=Q(transactions__type="expense") & (Q(transactions__date__month = date.today().month) & Q(transactions__date__year = date.today().year))),
                    0.0,
                    output_field=DecimalField(),
                ),
                highest_expense=Coalesce(
                    Max("transactions__amount", filter=Q(transactions__type="expense") & (Q(transactions__date__month = date.today().month) & Q(transactions__date__year = date.today().year))),
                    0.0,
                    output_field=DecimalField(),
                ),
            )
        )

        for category in category_breakdown:
            budgets = CategoryBudget.objects.filter(category=category["id"]).values("amount","month","year").order_by("-year","-month")
            category["budgets"] = budgets

        response_data = {
            "category": category_breakdown,
        }

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
            queryset
            .filter(transactions__isnull=False)
            .values("id","name","icon")
            .annotate(
                year=year_sql,
                month=month_sql,
                total_transactions=Count("transactions__id"),
                total_expenses=Coalesce(
                    Sum(
                        "transactions__amount",
                        filter=Q(transactions__type="expense"),
                    ),
                    0.0,
                    output_field=DecimalField(),
                ),
            )
            .order_by("-year", "-month", "name")
        )

        for item in monthly_breakdown:
            budget = CategoryBudget.objects.filter(category=item["id"], month__lte=item["month"], year__lte=item["year"]).values("amount").order_by("-year","-month").first()
            item["budget"] = budget["amount"] or 0

        response_data.update({"monthly_breakdown": monthly_breakdown})

        return Response(
            response_data
        )


@extend_schema_view(
    list=extend_schema(
        description="List all category budgets for the authenticated user",
        parameters=[
            OpenApiParameter(
                "category",
                type=OpenApiTypes.INT,
                description="Filter by category ID",
                required=False,
            ),
            OpenApiParameter(
                "month",
                type=OpenApiTypes.INT,
                description="Filter by month",
                required=False,
            ),
            OpenApiParameter(
                "year",
                type=OpenApiTypes.INT,
                description="Filter by year",
                required=False,
            ),
        ],
    ),
    create=extend_schema(
        description="Create a new category budget for the authenticated user",
    ),
    retrieve=extend_schema(
        description="Get a category budget by ID",
    ),
    update=extend_schema(
        description="Update a category budget by ID",
    ),
    partial_update=extend_schema(
        description="Partially update a category budget by ID",
    ),
    destroy=extend_schema(
        description="Delete a category budget by ID",
    ),
)
class CategoryBudgetViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CategoryBudgetSerializer
    queryset = CategoryBudget.objects.all()

    def get_queryset(self):
        """Get category budgets for the authenticated user"""
        queryset = super().get_queryset().filter(user=self.request.user)
        category = self.request.query_params.get("category", None)
        month = self.request.query_params.get("month", None)
        year = self.request.query_params.get("year", None)
        if category:
            queryset = queryset.filter(category=category)
        if month:
            queryset = queryset.filter(month=month)
        if year:
            queryset = queryset.filter(year=year)
        return queryset.order_by("-year", "-month", "category__name")

    def perform_create(self, serializer):
        """Set the user for the new category budget"""
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """Update a category budget"""
        serializer.save(user=self.request.user)
