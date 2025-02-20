from rest_framework import serializers
from .transaction_model import TransactionModel

class TransactionSerializer(serializers.ModelSerializer):
    approved_by = serializers.CharField(source='approved_by.username', allow_null=True)
    
    class Meta:
        model = TransactionModel
        fields = ['code', 'merchant', 'amount', 'status', 'timestamp', 'approved_by', 'is_flagged']
        