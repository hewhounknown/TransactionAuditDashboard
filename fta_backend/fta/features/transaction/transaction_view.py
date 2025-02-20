from rest_framework.viewsets import ModelViewSet
from .transaction_model import TransactionModel
from .transaction_serializer import TransactionSerializer
from rest_framework.pagination import PageNumberPagination

class TransactionPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000

class TransactionViewSet(ModelViewSet):
    queryset = TransactionModel.objects.all()
    serializer_class = TransactionSerializer
    pagination_class = TransactionPagination