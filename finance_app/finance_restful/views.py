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
from django.utils.dateparse import parse_date
from django.utils.dateparse import parse_date
from django.db.models.functions import TruncDate, ExtractYear,TruncMonth
from django.db.models import Sum, Max, Min
from django.db.models.functions import TruncDate
import pandas as pd
from datetime import datetime

class TransactionList(generics.ListCreateAPIView):
    queryset = Transactions.objects.all()
    serializer_class = TransactionsSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [AllowAny]
    def get_queryset(self):
        queryset = Transactions.objects.all().order_by('-transaction_date')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        #Evaluate if the date parameters has a value
        if start_date:
            queryset = queryset.filter(transaction_date__date__gte=parse_date(start_date))
        
        if end_date:
            queryset = queryset.filter(transaction_date__date__lte=parse_date(end_date))
        
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
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)

        if page is not None:
            return self.get_paginated_response(self.get_serializer(page, many=True).data)

        # Manually format the response to include 'results' key
        serializer = self.get_serializer(queryset, many=True)
        return Response({'results': serializer.data})

class TransactionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Transactions.objects.all()
    serializer_class = TransactionsSerializer
    permission_classes = [AllowAny]
    

class TransactionTypeList(generics.ListCreateAPIView):
    queryset = TransactionTypes.objects.all()
    serializer_class = TransactionTypeSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = TransactionTypes.objects.all()
        transaction_type = self.request.query_params.get('transaction_type')
        #Evaluate if the date parameters has a value
        if transaction_type:
            queryset = queryset.filter(type=int(transaction_type))
        return queryset

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
    
class SavingPlanDetail(generics.RetrieveUpdateDestroyAPIView):
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

class TransactionDataChartView(APIView):
    permission_classes = [AllowAny]

class TransactionDataChartView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        transactions = Transactions.objects.all()
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        year = self.request.query_params.get('year')

        if year:
            # Filter transactions by year
            transactions = transactions.filter(transaction_date__year=year)

            # Aggregate sum of debits and credits by month
            debits = (transactions.filter(type_of_transaction=2)
                        .annotate(month=TruncMonth('transaction_date'))
                        .values('month')
                        .annotate(total=Sum('amount'))
                        .order_by('month'))
            
            credits = (transactions.filter(type_of_transaction=1)
                        .annotate(month=TruncMonth('transaction_date'))
                        .values('month')
                        .annotate(total=Sum('amount'))
                        .order_by('month'))

            # Convert the querysets to lists of dictionaries
            debits_data = list(debits)
            credits_data = list(credits)
            
            # Rename 'month' to 'date' and format the date
            def format_month(item):
                return {
                    'date': item['month'].strftime('%Y-%m'),
                    'total': item['total']
                }

            debits_result = [format_month(item) for item in debits_data]
            credits_result = [format_month(item) for item in credits_data]

        else:
            if start_date:
                start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            else:
                start_date = transactions.aggregate(Min('transaction_date'))['transaction_date__min'].date()
            
            if end_date:
                end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            else:
                end_date = transactions.aggregate(Max('transaction_date'))['transaction_date__max'].date()
            
            if not start_date or not end_date:
                return Response({'error': 'Invalid date range'}, status=400)

            # Generate a list of all dates in the range
            all_dates = pd.date_range(start=start_date, end=end_date).date

            # Aggregate sum of debits and credits by date
            debits = (transactions.filter(type_of_transaction=2)
                                .annotate(date=TruncDate('transaction_date'))
                                .values('date')
                                .annotate(total=Sum('amount'))
                                .order_by('date'))
            
            credits = (transactions.filter(type_of_transaction=1)
                                .annotate(date=TruncDate('transaction_date'))
                                .values('date')
                                .annotate(total=Sum('amount'))
                                .order_by('date'))
            
            # Convert the querysets to lists of dictionaries
            debits_data = list(debits)
            credits_data = list(credits)
            
            # Initialize dictionaries for results
            debits_dict = {item['date']: item['total'] for item in debits_data}
            credits_dict = {item['date']: item['total'] for item in credits_data}
            
            # Create lists with all dates, adding missing dates with a total of 0
            debits_result = [{'date': date, 'total': debits_dict.get(date, 0)} for date in all_dates]
            credits_result = [{'date': date, 'total': credits_dict.get(date, 0)} for date in all_dates]

        data = {
            'debits': debits_result,
            'credits': credits_result
        }
        print(data)
        return Response(data)


class IncomeByTransactionTypeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        transactions = Transactions.objects.all()
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        transaction_type = request.query_params.get('transaction_type')
        
        if start_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d')
        else:
            start_date = transactions.aggregate(Min('transaction_date'))['transaction_date__min'].date()
        
        if end_date:
            end_date = datetime.strptime(end_date, '%Y-%m-%d')
        else:
            end_date = transactions.aggregate(Max('transaction_date'))['transaction_date__max'].date()
        
        if not start_date or not end_date:
            return Response({'error': 'Invalid date range'}, status=400)

        filtered_transactions = transactions.filter(transaction_date__date__range=(start_date, end_date))

        income_by_type = (filtered_transactions
                          .values('transaction_category__description').filter(transaction_category__type=int(transaction_type))
                          .annotate(total_income=Sum('amount'))
                          .order_by('transaction_category__description'))
        
        data = list(income_by_type)

        return Response(data)

        
        