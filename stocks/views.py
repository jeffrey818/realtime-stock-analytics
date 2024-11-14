from django.shortcuts import render
from django.http import JsonResponse
from .tasks import fetch_stock_data
from datetime import datetime, timedelta
from stocks.ml.utils import load_model


# Create your views here.
def fetch_stock(request, symbol):
    # Call the task to fetch stock data
    fetch_stock_data.delay(symbol)
    return JsonResponse({'message': f'Stock data fetch initiated for {symbol}.'})


# def predict_stock_price(request, symbol):
#     model = load_model()  # Load the pre-trained model from file
    
#     # Predict for the next day
#     future_timestamp = datetime.now() + timedelta(days=1)
#     future_unix_time = int(future_timestamp.timestamp())
#     predicted_price = model.predict([[future_unix_time]])

#     return JsonResponse({'symbol': symbol, 'predicted_price': predicted_price[0]})


def predict_stock_price(request, symbol):
    '''
    Example response: {
    "symbol": "AAPL",
    "predicted_price": 150.75,
    "prediction_date": "2024-11-15 15:00:00"
    }
    '''
    # Load the trained model
    model = load_model()
    if model is None:
        return JsonResponse({'error': 'Model not found or failed to load'}, status=500)
    
    # Set the timestamp for the prediction (e.g., one day in the future)
    future_timestamp = datetime.now() + timedelta(days=1)
    future_unix_time = int(future_timestamp.timestamp())
    
    # Predict the stock price
    try:
        predicted_price = model.predict([[future_unix_time]])
        return JsonResponse({
            'symbol': symbol,
            'predicted_price': round(predicted_price[0], 2),  # Round for clarity
            'prediction_date': future_timestamp.strftime('%Y-%m-%d %H:%M:%S')
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
