from rest_framework import routers
from .features.transaction.transaction_view import TransactionViewSet

router = routers.DefaultRouter()

router.register(r'transactions', TransactionViewSet)