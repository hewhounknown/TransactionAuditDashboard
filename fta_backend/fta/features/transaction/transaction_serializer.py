from rest_framework.serializers import ModelSerializer
from .transaction_model import TransactionModel

class TransactionSerializer(ModelSerializer):
    class Meta:
        model = TransactionModel
        fields = ['code', 'merchant', 'amount', 'status', 'timestamp', 'approved_by', 'is_flagged']
        