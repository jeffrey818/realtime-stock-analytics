# stocks/ml/train_model.py

import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from stocks.models import Stock
from django.utils import timezone
from datetime import datetime

# Fetch historical data for training
def get_historical_data(symbol):
    stock_records = Stock.objects.filter(symbol=symbol).order_by('timestamp')
    data = pd.DataFrame.from_records(
        stock_records.values('timestamp', 'price'),
        index='timestamp'
    )
    data['price'] = data['price'].astype(float)
    data['timestamp'] = data.index.astype(np.int64) // 10**9
    return data

# Train a simple linear regression model
def train_and_save_model(symbol, filename='stocks/ml/models/stock_model.pkl'):
    try:
        print("Fetching historical data...")
        data = get_historical_data(symbol)
        print(f"Data fetched for symbol {symbol}: {data.head()}")

        X = data['timestamp'].values.reshape(-1, 1)
        y = data['price'].values
        print("Training model...")

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)
        model = LinearRegression()
        model.fit(X_train, y_train)
        print("Model trained successfully.")

        joblib.dump(model, filename)
        print(f"Model saved as {filename}")
    except Exception as e:
        print(f"Error during model saving: {e}")

# Example usage:
train_and_save_model('AAPL')
