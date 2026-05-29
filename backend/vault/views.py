from rest_framework import status
from django.core.exceptions import ValidationError
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiParameter, OpenApiTypes
from django.utils import timezone
from django.db.models import Sum
from rest_framework.response import Response
from rest_framework import viewsets, mixins
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

    @extend_schema(description="Get the stats of a vault")
    @action(detail=True, methods=["get"], url_path="stats")
    def stats(self, request, pk):
        """Get the stats of a vault"""

        try:
            vault = Vault.objects.filter(user=request.user).get(pk=pk)
        except Vault.DoesNotExist:
            return Response({"error": "Vault not found"}, status=status.HTTP_404_NOT_FOUND)
        total_contributions = VaultContributions.objects.filter(vault=vault).aggregate(Sum("amount"))
        percentage_complete = (total_contributions["amount__sum"] / vault.target_amount) * 100
        days_remaining = (vault.target_date - timezone.now().date()).days

        return Response(
            {
                "goal": vault.target_amount,
                "total_contributed": total_contributions["amount__sum"],
                "percentage_complete": percentage_complete,
                "deadline": vault.target_date,
                "days_remaining": days_remaining,
            }
        )

    @action(detail=True, methods=["post"], url_path="contribute", serializer_class=VaultContributionsSerializer)
    def contribute(self, request):
        """Contribute to a vault"""
        vault = self.get_object()
        serializer = VaultContributionsSerializer(data=request.data, context={"request": request})

        serializer.is_valid(raise_exception=True)
        serializer.save(user=self.request.user, vault=vault)

        return Response({"message": "Contribution added successfully"})

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
        contributions = VaultContributions.objects.filter(user=self.request.user).order_by("-date")

        if pk:
            try:
                vault = vaults.get(pk=pk)
                contributions = contributions.filter(vault=vault)
            except Vault.DoesNotExist:
                return Response({"error": "Vault not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response(
            {
                "id": contribution.id,
                "vault_name": contribution.vault.name,
                "source_account_name": contribution.source_account.name,
                "amount": contribution.amount,
                "date": contribution.date,
            }
            for contribution in contributions
        )
