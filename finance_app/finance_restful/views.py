from rest_framework.views import APIView
from django.http import Http404
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from rest_framework import generics
from django.contrib.auth.models import User
from django.http import JsonResponse
from decimal import Decimal
from .pagination import * 
from rest_framework.permissions import AllowAny

class TransactionList(generics.ListCreateAPIView):
    queryset = Transactions.objects.all()
    serializer_class = TransactionsSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [AllowAny]
    def get_queryset(self):
        queryset = Transactions.objects.all().order_by('-transaction_date')
        
        # Filtering based on query parameter
        
        return queryset
    
    def post(self, request, *args, **kwargs):
        transaction_serializer = self.serializer_class(data=request.data)
        if transaction_serializer.is_valid():
            amount = Decimal(transaction_serializer.validated_data["amount"])
            bank_object = transaction_serializer.validated_data["bank_account"]
            new_balance = bank_object.current_balance + amount if transaction_serializer.validated_data["type_of_transaction"] == 1 else bank_object.current_balance - amount
            
            if new_balance < 0:
                return Response({"status":"ERROR","body":{"text":"Insufficient funds for this transaction."} }, status=status.HTTP_400_BAD_REQUEST)
            
            bank_object.current_balance = new_balance
            bank_object.save()
            return self.create(request, *args, **kwargs)
        
        return Response({"status":"ERROR","body":{"errors":transaction_serializer.errors}}, status=status.HTTP_400_BAD_REQUEST)

class TransactionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Transactions.objects.all()
    serializer_class = TransactionsSerializer
    permission_classes = [AllowAny]
    

class TransactionTypeList(generics.ListCreateAPIView):
    queryset = TransactionTypes.objects.all()
    serializer_class = TransactionTypeSerializer
    permission_classes = [AllowAny]

class TransactionTypeDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = TransactionTypes.objects.all()
    serializer_class = TransactionTypeSerializer
    permission_classes = [AllowAny]
    
class SavingTypeList(generics.ListCreateAPIView):
    queryset=SavingTypes.objects.all()
    serializer_class = SavingTypeSerializer
    permission_classes = [AllowAny]

class SavingTypeDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset=SavingTypes.objects.all()
    serializer_class = SavingTypeSerializer
    permission_classes = [AllowAny]

class SavingPlanList(generics.ListCreateAPIView):
    queryset=SavingGoals.objects.all()
    serializer_class = SavingGoalSerializer
    permission_classes = [AllowAny]
    
class SavingPlanDetail(generics.ListCreateAPIView):
    queryset=SavingGoals.objects.all()
    serializer_class = SavingGoalSerializer
    permission_classes = [AllowAny]

class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class BankAccountListCreateView(generics.ListCreateAPIView):
    queryset = BankAccount.objects.all()
    serializer_class = BankAccountSerializer
    permission_classes = [AllowAny]
    
class BankAccountDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BankAccount.objects.all()
    serializer_class = BankAccountSerializer
    permission_classes = [AllowAny]