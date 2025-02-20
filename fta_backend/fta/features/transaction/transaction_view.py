from rest_framework.viewsets import ModelViewSet
from .transaction_model import TransactionModel
from .transaction_serializer import TransactionSerializer

class TransactionViewSet(ModelViewSet):
    queryset = TransactionModel.objects.all()
    serializer_class = TransactionSerializer