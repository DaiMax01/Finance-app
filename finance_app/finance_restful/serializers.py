from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *
from django.conf import settings

class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model=settings.AUTH_USER_MODEL
        fields=['username','email']
    
class TransactionsSerializer(serializers.ModelSerializer):
    transaction_date = serializers.DateTimeField(format='%Y-%m-%d',read_only=True)
    class Meta:
        model = Transactions
        fields = '__all__'  # This will include all fields in the Transactions model
        read_only_fields = ['id', 'transaction_id', 'transaction_date']
        
class TransactionTypeSerializer(serializers.ModelSerializer):
    type_display = serializers.SerializerMethodField()
    class Meta:
        model= TransactionTypes
        fields = '__all__'
        read_only_fields=['type_display']
        
    def get_type_display(self, obj):
        account_type = dict(TransactionTypes.ACCOUNT_TYPES)
        return account_type.get(obj.type, 'Unknown')
        
class SavingTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model=SavingTypes
        fields='__all__'

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'first_name', 'last_name']

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class SavingGoalSerializer(serializers.ModelSerializer):
    bank_account_balance = serializers.SerializerMethodField()
    saving_type_display = serializers.SerializerMethodField()
    class Meta:
        model = SavingGoals
        fields = '__all__'

    def get_bank_account_balance(self, obj):
        return obj.bank_account.current_balance
    
    def get_saving_type_display(self, obj):
        return obj.saving_type.description

class BankAccountSerializer(serializers.ModelSerializer):
    account_type_display = serializers.SerializerMethodField()

    class Meta:
        model = BankAccount
        fields = '__all__'
        read_only_fields = ['amount','account_type_display']

    def get_account_type_display(self, obj):
        # Devuelve la representación legible del account_type
        account_types = dict(BankAccount.ACCOUNT_TYPES)  # Convertir a diccionario para búsqueda
        return account_types.get(obj.account_type, 'Unknown')