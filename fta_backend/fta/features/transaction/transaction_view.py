from rest_framework.viewsets import ModelViewSet
from .transaction_model import TransactionModel
from .transaction_serializer import TransactionSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.filters import SearchFilter
from django.db.models import Sum, Count
from django.contrib.auth import get_user_model

class TransactionPagination(PageNumberPagination):
    page_size = 30
    page_size_query_param = 'page_size'
    max_page_size = 100

class TransactionViewSet(ModelViewSet):
    queryset = TransactionModel.objects.all()
    serializer_class = TransactionSerializer
    pagination_class = TransactionPagination
    filter_backends = [SearchFilter]
    search_fields = ['merchant']

    def get_queryset(self):
        transactions = TransactionModel.objects.all()
        status = self.request.query_params.get('status')
        if status:
            transactions = transactions.filter(status=status)
        return transactions
    
    @action(detail=True, methods=['PUT'])
    def approve(self, request, pk=None):
        transaction = self.get_object()

        if transaction.status == 'completed':
            return Response(
                {"error": "this transaction is already completed"},
                status=status.HTTP_400_BAD_REQUEST
                )

        if transaction.status == 'failed':
            return Response(
                {"error": "this transaction is failed"},
                status=status.HTTP_400_BAD_REQUEST
                )
        
        superuser = get_user_model().objects.get(is_superuser=True)
        transaction.status = 'completed'
        transaction.approved_by = superuser
        transaction.save()

        serializer = self.get_serializer(transaction)
        return Response(serializer.data)
    
    @action(detail=True, methods=['PUT'])
    def flag(self, request, pk=None):
        transaction = self.get_object()
        transaction.is_flagged = not transaction.is_flagged
        transaction.save()

        serializer = self.get_serializer(transaction)
        return Response(serializer.data)
    
    @action(detail=False, methods=['GET'], url_path='summary-per-status')
    def summary_per_status(self, request):
        transactions = self.get_queryset()
        data = transactions.values('status').annotate(total_amount=Sum('amount'), transaction_count=Count('code'))

        response_data = list(data)
        return Response(response_data)
    
    @action(detail=False, methods=['GET'], url_path='summary-per-merchant')
    def summary_per_merchant(self, request):
        transactions = self.get_queryset()
        data = (
            transactions.values('merchant')
            .annotate(total_amount=Sum('amount'), transaction_count=Count('code'))
            .order_by('-total_amount')
        )

        response_data = list(data)
        return Response(response_data)
