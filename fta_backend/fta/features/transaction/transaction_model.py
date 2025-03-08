from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class TransactionModel(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'failed'),
    ]

    code = models.CharField(max_length=7, unique=True, primary_key=True, editable=False)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    merchant = models.CharField(max_length=200, null=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    is_flagged = models.BooleanField(default=False)
    approved_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)

    class Meta:
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['merchant'])
        ]
        ordering = ['-timestamp']

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = uuid.uuid4().hex[:6].upper()

        super().save(*args, **kwargs)

    # @property
    # def get_approved_by(self):
    #     return self.approved_by if self.approved_by and self.approved_by.is_authenticated else None

    # def set_approved_by(self, user):
    #     self.approved_by = user if user and user.is_authenticated else None
