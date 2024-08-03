import uuid
from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
# Create your models here.

transaction_choices =((1,"Deposit"),
                      (2,"Withdrawal"))

account_types =((2,"Saving Account"),
                (1,"Main Account"))

is_active = (
    (0, 'INACTIVE'),
    (1, 'ACTIVE'),
)


class BankAccount(models.Model):
    current_balance = models.DecimalField(max_digits=20, decimal_places=8,null=True)
    description=models.CharField(null=True)
    account_type=models.IntegerField(choices=account_types, null=True)
    account_code = models.CharField(max_length=4, null=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING, null=True)
    

class TransactionTypes(models.Model):
    code = models.CharField(max_length=4)
    description = models.CharField(max_length=200)
    
class Transactions(models.Model):
    transaction_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    amount = models.DecimalField(max_digits=20, decimal_places=8)
    type_of_transaction = models.IntegerField(choices=transaction_choices)
    transaction_category = models.ForeignKey(TransactionTypes,on_delete=models.DO_NOTHING)
    description = models.CharField(max_length=500)
    transaction_date = models.DateTimeField(default=timezone.now)
    bank_account = models.ForeignKey(BankAccount,on_delete=models.DO_NOTHING)

    
class SavingTypes(models.Model):
    code = models.CharField(max_length=4)
    description = models.CharField(max_length=200)
class SavingGoals(models.Model):
    code = models.CharField(max_length=4)
    amount = models.DecimalField(max_digits=20, decimal_places=8)
    description = models.CharField(max_length=500)
    bank_account = models.ForeignKey(BankAccount,on_delete=models.DO_NOTHING)
    saving_type = models.ForeignKey(SavingTypes, on_delete=models.DO_NOTHING)
    active = models.IntegerField(choices=is_active, null=False, blank=False, default=1)
    
    

    