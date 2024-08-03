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
    class Meta:
        model= TransactionTypes
        fields = '__all__'
        
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
    class Meta:
        model = SavingGoals
        fields='__all__'

class BankAccountSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = BankAccount
        fields='__all__'