from rest_framework.viewsets import ModelViewSet
from .transaction_model import TransactionModel
from .transaction_serializer import TransactionSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter

class TransactionPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000

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
