from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import random
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from ...features.transaction.transaction_model import TransactionModel
import uuid

load_dotenv() 

User = get_user_model()

class Command(BaseCommand):
    help = "Seed sample data into database"

    def handle(self, *args, **options):
        self.create_admin()
        self.create_transactions()

    def create_admin(self):
        username = os.environ.get("SUPER_NAME")
        email = os.environ.get("SUPER_EMAIL")
        password = os.environ.get("SUPER_PASSWORD")

        is_existed = User.objects.filter(username=username, is_superuser=True).exists()

        if not is_existed:
            User.objects.create_superuser(username=username, email=email, password=password)
            print("admin is created successfully")
        else:
            print("admin is already created")

    def create_transactions(self):
        admin = User.objects.filter(is_superuser=True).first()
        for i in range(10000):
            # To prevent code duplication
            while True:
                code = uuid.uuid4().hex[:6].upper()
                if not TransactionModel.objects.filter(code=code).exists():
                    break
            amount = round(random.uniform(100.00,10000.00) ,2)
            merchant =  f'Merchant {random.randint(1, 22)}'
            timestamp = datetime.now() - timedelta(days=random.randint(1, 365))
            status = random.choice(['pending', 'completed', 'failed'])
            is_flagged = random.choice([True, False])
            approved_by = admin if status == "completed" else None
            transaction, created = TransactionModel.objects.get_or_create(
                code=code,
                amount=amount,
                merchant=merchant,
                timestamp=timestamp,
                status=status,
                is_flagged=is_flagged,
                approved_by=approved_by
            )
            if created :
                print("Transaction already exited", transaction)
            