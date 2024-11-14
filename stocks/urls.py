# urls.py
from django.urls import path
from .views import fetch_stock
from . import views

urlpatterns = [
    path('fetch-stock/<str:symbol>/', fetch_stock, name='fetch_stock'),
    # ... other URL patterns ...
    path('predict/<str:symbol>/', views.predict_stock_price, name='predict_stock_price'),
]