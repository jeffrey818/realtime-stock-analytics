import os
import requests
from celery import shared_task
from django.utils import timezone
from .models import Stock
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

ALPHA_VANTAGE_API_KEY = os.getenv('ALPHA_VANTAGE_API_KEY')
BASE_URL = 'https://www.alphavantage.co/query'

@shared_task
def fetch_stock_data(symbol):
    params = {
        'function': 'TIME_SERIES_INTRADAY',
        'symbol': symbol,
        'interval': '1min',
        'apikey': ALPHA_VANTAGE_API_KEY
    }
    
    try:
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        data = response.json()
        
        # Log the fetched data
        print(f"Fetched data for {symbol}: {data}")  # Add this line
        
        time_series = data.get('Time Series (1min)', {})
        if not time_series:
            print(f"No time series data found for symbol: {symbol}")
            return

        latest_timestamp = list(time_series.keys())[0]
        latest_data = time_series[latest_timestamp]
        price = float(latest_data['4. close'])

        # Save the data to the database
        stock_record = Stock.objects.create(
            symbol=symbol,
            price=price,
            timestamp=timezone.now()
        )

        # Trigger a real-time WebSocket update
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            symbol,
            {
                'type': 'stock_update',
                'symbol': symbol,
                'price': price,
                'timestamp': str(stock_record.timestamp),
            }
        )
        
        print(f"Stock update sent for {symbol}: {price}")  # Log the sent update

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data for symbol {symbol}: {e}")
    except (KeyError, ValueError) as e:
        print(f"Error processing data for symbol {symbol}: {e}")
