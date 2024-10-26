# urls.py
from django.urls import path
from .views import fetch_stock

urlpatterns = [
    path('fetch-stock/<str:symbol>/', fetch_stock, name='fetch_stock'),
    # ... other URL patterns ...
]