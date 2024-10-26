from django.shortcuts import render
from django.http import JsonResponse
from .tasks import fetch_stock_data

# Create your views here.
def fetch_stock(request, symbol):
    # Call the task to fetch stock data
    fetch_stock_data.delay(symbol)
    return JsonResponse({'message': f'Stock data fetch initiated for {symbol}.'})
