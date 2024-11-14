import joblib

def load_model(filename='stocks/ml/models/stock_model.pkl'):
    try:
        model = joblib.load(filename)
        return model
    except FileNotFoundError:
        print(f"Model file {filename} not found.")
        return None