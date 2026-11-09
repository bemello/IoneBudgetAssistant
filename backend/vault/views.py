from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes
from django.utils import timezone
from django.db.models import Sum, DecimalField, DateField, Count, F
from django.db.models.functions import Cast
from rest_framework import viewsets, mixins, status
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action

from core.models import Vault, VaultContributions, Account
from vault.serializers import VaultSerializer, VaultContributionsSerializer


class VaultViewSet(viewsets.ModelViewSet):
    """Manage vaults in the database"""

    serializer_class = VaultSerializer
    queryset = Vault.objects.all()
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Retrieve the vaults for authenticated user"""
        return self.queryset.filter(user=self.request.user).order_by("-name")

    def perform_create(self, serializer):
        """Create a new vault"""
        serializer.save(user=self.request.user)

    @extend_schema(
        description="Get vaults statistics",
        parameters=[
            OpenApiParameter(
                "vault_id",
                OpenApiTypes.INT,
                required=False,
                description="Filter by vault id",
            ),            
        ],
    )
    @action(detail=False, methods=["get"], url_path="stats")
    def stats(self, request):
        """Get the stats of the vaults"""
        queryset = Vault.objects.filter(user=request.user)

        vault_id = request.query_params.get("vault_id", None)

        if vault_id:
            queryset = queryset.filter(pk=vault_id)

        vaults_breakdown = list(
            queryset.values("name", "target_amount", "target_date")
            .annotate(
                total_contributed = Sum("vault_contributions__transaction__amount"),
                total_contributions = Count("vault_contributions"),
            )
        )

        total_contributed = (
            queryset.aggregate(
                total_contributed = Sum("vault_contributions__transaction__amount"),
            )
        )

        for item in vaults_breakdown:
            item["progress"] = (item["total_contributed"] / item["target_amount"]) * 100
            item["remaining_days"] = (item["target_date"] - timezone.now().date()).days

        return Response(
            {
                "total_contributed": total_contributed["total_contributed"] or 0,
                "vaults": vaults_breakdown
            }
        )

    @action(detail=True, methods=["post"], url_path="contribute", serializer_class=VaultContributionsSerializer)
    def contribute(self, request, pk):
        """Contribute to a vault"""
        try:
            vault = Vault.objects.filter(user=request.user).get(pk=pk)
        except Vault.DoesNotExist:
            return Response({"error": "Vault not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = VaultContributionsSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save(user=self.request.user, vault=vault)

        return Response(serializer.data)

    @extend_schema(
        description="Get vault contributions",
        parameters=[
            OpenApiParameter(
                "vault_id",
                OpenApiTypes.INT,
                required=False,
                description="Filter by vault id",
            ),
        ],
    )
    @action(detail=False, methods=["get"], url_path="contributions")
    def contributions(self, request):
        """Get the contributions for the authenticated user"""

        pk = request.query_params.get("vault_id", None)
        vaults = Vault.objects.filter(user=self.request.user)
        contributions = VaultContributions.objects.filter(user=self.request.user).order_by("-transaction__date")

        if pk:
            try:
                vault = vaults.get(pk=pk)
                contributions = contributions.filter(vault=vault)
            except Vault.DoesNotExist:
                return Response({"error": "Vault not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response(
            VaultContributionsSerializer(contributions, many=True).data
            # {
            #     "id": contribution.id,
            #     "vault_name": contribution.vault.name,
            #     "account_name": contribution.account.name,
            #     "amount": contribution.transaction.amount,
            #     "date": contribution.transaction.date,
            # }
            # for contribution in contributions
        )
