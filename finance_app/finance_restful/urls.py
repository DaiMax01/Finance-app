from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
urlpatterns = [
    path('transactions/', TransactionList.as_view(), name='transaction-list'),
    path('transactions/<int:pk>/', TransactionTypeDetail.as_view(), name='transaction-detail'),
    path('transaction-type/', TransactionTypeList.as_view()),
    path('transaction-type/<int:pk>/', TransactionTypeDetail.as_view()),
    path('saving-types/',SavingTypeList.as_view()),
    path('saving-types/<int:pk>/',SavingTypeDetail.as_view()),
    path('saving-goals/',SavingPlanList.as_view()),
    path('saving-goals/<int:pk>',SavingPlanDetail.as_view()),
    path('users/', UserListCreateView.as_view(), name='user-create'),
    path('bank-account/',BankAccountListCreateView.as_view()),
    path('bank-account/<int:pk>', BankAccountDetailView.as_view()),
    path('transaction-chart-data/',TransactionDataChartView.as_view()),
    path('transaction-by-type/',IncomeByTransactionTypeView.as_view())
    
    
]