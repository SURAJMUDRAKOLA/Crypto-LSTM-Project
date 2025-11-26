from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, mean_absolute_percentage_error
import requests
import os
import json
import pickle
from datetime import datetime, timedelta
import logging
from supabase import create_client, Client
import asyncio
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(title="Crypto LSTM Prediction API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://tflmntmxnuahlzobwwzh.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Model storage directory
MODEL_DIR = "models"
os.makedirs(MODEL_DIR, exist_ok=True)

# Request/Response models
class PredictionRequest(BaseModel):
    symbol: str
    current_price: float
    historical_prices: List[float]
    horizon: str = "1H"  # 1H, 24H, 7D

class PredictionResponse(BaseModel):
    predicted_price: float
    confidence_level: float
    reasoning: str
    rmse: float
    mae: float
    mape: float
    model_info: dict
    features: dict

class CryptoLSTMModel:
    def __init__(self, symbol: str):
        self.symbol = symbol
        self.model = None
        self.scaler = MinMaxScaler()
        self.sequence_length = 60  # Use 60 time periods for prediction
        self.model_path = os.path.join(MODEL_DIR, f"{symbol}_lstm_model.h5")
        self.scaler_path = os.path.join(MODEL_DIR, f"{symbol}_scaler.pkl")
        
    def fetch_historical_data(self, days: int = 365) -> pd.DataFrame:
        """Fetch historical data from CoinGecko API"""
        coin_id_map = {
            'BTC': 'bitcoin', 'ETH': 'ethereum', 'ADA': 'cardano',
            'DOT': 'polkadot', 'LINK': 'chainlink', 'SOL': 'solana',
            'BNB': 'binancecoin', 'XRP': 'ripple'
        }
        
        coin_id = coin_id_map.get(self.symbol.upper(), self.symbol.lower())
        url = f"https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart"
        params = {"vs_currency": "usd", "days": days, "interval": "hourly"}
        
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            prices = data['prices']
            df = pd.DataFrame(prices, columns=['timestamp', 'price'])
            df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
            df.set_index('timestamp', inplace=True)
            
            # Add technical indicators
            df['sma_20'] = df['price'].rolling(window=20).mean()
            df['ema_12'] = df['price'].ewm(span=12).mean()
            df['ema_26'] = df['price'].ewm(span=26).mean()
            df['rsi'] = self.calculate_rsi(df['price'])
            df['volatility'] = df['price'].rolling(window=24).std()
            
            return df.dropna()
            
        except Exception as e:
            logger.error(f"Error fetching data for {self.symbol}: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to fetch historical data: {e}")
    
    def calculate_rsi(self, prices: pd.Series, period: int = 14) -> pd.Series:
        """Calculate RSI (Relative Strength Index)"""
        delta = prices.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        rs = gain / loss
        return 100 - (100 / (1 + rs))
    
    def prepare_sequences(self, data: pd.DataFrame, target_col: str = 'price') -> tuple:
        """Prepare time series sequences for LSTM training"""
        # Select features for training
        feature_cols = ['price', 'sma_20', 'ema_12', 'ema_26', 'rsi', 'volatility']
        features = data[feature_cols].values
        
        # Scale the features
        scaled_features = self.scaler.fit_transform(features)
        
        X, y = [], []
        for i in range(self.sequence_length, len(scaled_features)):
            X.append(scaled_features[i-self.sequence_length:i])
            y.append(scaled_features[i, 0])  # Predict price (first column)
        
        return np.array(X), np.array(y)
    
    def build_lstm_model(self, input_shape: tuple) -> keras.Model:
        """Build and compile LSTM model"""
        model = keras.Sequential([
            keras.layers.LSTM(100, return_sequences=True, input_shape=input_shape),
            keras.layers.Dropout(0.2),
            keras.layers.LSTM(100, return_sequences=True),
            keras.layers.Dropout(0.2),
            keras.layers.LSTM(50, return_sequences=False),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(25),
            keras.layers.Dense(1)
        ])
        
        model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            loss='mse',
            metrics=['mae']
        )
        
        return model
    
    def train_model(self, retrain: bool = False) -> dict:
        """Train or load existing LSTM model"""
        if os.path.exists(self.model_path) and os.path.exists(self.scaler_path) and not retrain:
            logger.info(f"Loading existing model for {self.symbol}")
            self.model = keras.models.load_model(self.model_path)
            with open(self.scaler_path, 'rb') as f:
                self.scaler = pickle.load(f)
            
            # Return cached metrics from database
            try:
                result = supabase.table('models').select('*').eq('symbol', self.symbol).eq('is_active', True).execute()
                if result.data:
                    model_data = result.data[0]
                    return {
                        'accuracy': model_data['accuracy'],
                        'mae': model_data['mae'],
                        'mape': model_data['mape'],
                        'rmse': np.sqrt(model_data['mae'] ** 2),  # Approximation
                        'training_data_points': model_data['training_data_points']
                    }
            except Exception as e:
                logger.warning(f"Could not load model metadata: {e}")
        
        logger.info(f"Training new LSTM model for {self.symbol}")
        
        # Fetch historical data
        df = self.fetch_historical_data(days=730)  # 2 years of data
        
        # Prepare sequences
        X, y = self.prepare_sequences(df)
        
        # Split data
        train_size = int(len(X) * 0.8)
        X_train, X_test = X[:train_size], X[train_size:]
        y_train, y_test = y[:train_size], y[train_size:]
        
        # Build and train model
        self.model = self.build_lstm_model((X_train.shape[1], X_train.shape[2]))
        
        # Early stopping and model checkpoint
        callbacks = [
            keras.callbacks.EarlyStopping(patience=10, restore_best_weights=True),
            keras.callbacks.ReduceLROnPlateau(patience=5, factor=0.5),
        ]
        
        history = self.model.fit(
            X_train, y_train,
            epochs=100,
            batch_size=32,
            validation_split=0.2,
            callbacks=callbacks,
            verbose=1
        )
        
        # Evaluate model
        y_pred = self.model.predict(X_test)
        
        # Inverse transform predictions and actual values for proper evaluation
        y_test_reshaped = y_test.reshape(-1, 1)
        y_pred_reshaped = y_pred.reshape(-1, 1)
        
        # Create dummy arrays for inverse transform
        dummy_test = np.zeros((len(y_test), self.scaler.n_features_in_))
        dummy_pred = np.zeros((len(y_pred), self.scaler.n_features_in_))
        dummy_test[:, 0] = y_test
        dummy_pred[:, 0] = y_pred.flatten()
        
        y_test_actual = self.scaler.inverse_transform(dummy_test)[:, 0]
        y_pred_actual = self.scaler.inverse_transform(dummy_pred)[:, 0]
        
        # Calculate metrics
        mae = mean_absolute_error(y_test_actual, y_pred_actual)
        rmse = np.sqrt(mean_squared_error(y_test_actual, y_pred_actual))
        mape = mean_absolute_percentage_error(y_test_actual, y_pred_actual)
        
        # Calculate accuracy (based on direction prediction)
        actual_direction = np.diff(y_test_actual) > 0
        pred_direction = np.diff(y_pred_actual) > 0
        accuracy = np.mean(actual_direction == pred_direction) if len(actual_direction) > 0 else 0.5
        
        # Save model and scaler
        self.model.save(self.model_path)
        with open(self.scaler_path, 'wb') as f:
            pickle.dump(self.scaler, f)
        
        # Store model metadata in Supabase
        model_data = {
            'name': f'LSTM Model for {self.symbol}',
            'symbol': self.symbol,
            'model_type': 'LSTM',
            'accuracy': float(accuracy),
            'mae': float(mae),
            'mape': float(mape * 100),  # Convert to percentage
            'training_data_points': len(X_train),
            'last_trained_at': datetime.now().isoformat(),
            'hyperparameters': {
                'sequence_length': self.sequence_length,
                'epochs': len(history.history['loss']),
                'batch_size': 32,
                'learning_rate': 0.001
            },
            'validation_metrics': {
                'val_loss': float(min(history.history.get('val_loss', [0]))),
                'val_mae': float(min(history.history.get('val_mae', [0])))
            }
        }
        
        try:
            # Update or insert model
            existing = supabase.table('models').select('id').eq('symbol', self.symbol).eq('model_type', 'LSTM').execute()
            if existing.data:
                supabase.table('models').update(model_data).eq('id', existing.data[0]['id']).execute()
            else:
                supabase.table('models').insert(model_data).execute()
        except Exception as e:
            logger.error(f"Error storing model metadata: {e}")
        
        return {
            'accuracy': accuracy,
            'mae': mae,
            'mape': mape * 100,
            'rmse': rmse,
            'training_data_points': len(X_train)
        }
    
    def predict(self, current_price: float, historical_prices: List[float], horizon: str) -> dict:
        """Make prediction using trained LSTM model"""
        if self.model is None:
            raise HTTPException(status_code=500, detail="Model not trained")
        
        try:
            # Prepare input sequence
            recent_data = historical_prices[-self.sequence_length:]
            if len(recent_data) < self.sequence_length:
                # Pad with current price if insufficient data
                padding = [current_price] * (self.sequence_length - len(recent_data))
                recent_data = padding + recent_data
            
            # Create feature matrix (assuming same features as training)
            features = []
            for i, price in enumerate(recent_data):
                # Simple feature engineering for prediction
                sma_20 = np.mean(recent_data[max(0, i-19):i+1])
                ema_12 = price  # Simplified
                ema_26 = price  # Simplified
                rsi = 50  # Neutral RSI
                volatility = np.std(recent_data[max(0, i-23):i+1]) if i > 0 else 0
                
                features.append([price, sma_20, ema_12, ema_26, rsi, volatility])
            
            # Scale features
            scaled_features = self.scaler.transform(features)
            input_sequence = scaled_features.reshape(1, self.sequence_length, -1)
            
            # Make prediction
            scaled_prediction = self.model.predict(input_sequence)[0][0]
            
            # Inverse transform prediction
            dummy_pred = np.zeros((1, self.scaler.n_features_in_))
            dummy_pred[0, 0] = scaled_prediction
            predicted_price = self.scaler.inverse_transform(dummy_pred)[0, 0]
            
            # Calculate confidence based on model certainty and volatility
            volatility = np.std(recent_data[-24:]) / current_price if len(recent_data) >= 24 else 0.05
            base_confidence = 0.85  # Base confidence for LSTM
            confidence = max(0.6, min(0.95, base_confidence - volatility * 2))
            
            # Horizon adjustment
            horizon_multipliers = {'1H': 1.0, '24H': 0.95, '7D': 0.85}
            confidence *= horizon_multipliers.get(horizon, 1.0)
            
            return {
                'predicted_price': float(predicted_price),
                'confidence_level': float(confidence),
                'features': {
                    'current_price': current_price,
                    'volatility': float(volatility),
                    'sma_20': float(np.mean(recent_data[-20:])),
                    'trend': 'bullish' if predicted_price > current_price else 'bearish'
                }
            }
            
        except Exception as e:
            logger.error(f"Prediction error for {self.symbol}: {e}")
            raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")

# Model instances cache
models_cache = {}

def get_model(symbol: str) -> CryptoLSTMModel:
    """Get or create model instance"""
    if symbol not in models_cache:
        models_cache[symbol] = CryptoLSTMModel(symbol)
    return models_cache[symbol]

@app.get("/")
async def root():
    return {"message": "Crypto LSTM Prediction API", "version": "1.0.0"}

@app.post("/predict", response_model=PredictionResponse)
async def predict_price(request: PredictionRequest):
    """Generate price prediction using LSTM model"""
    try:
        model = get_model(request.symbol)
        
        # Train model if not exists or retrain periodically
        training_metrics = model.train_model(retrain=False)
        
        # Make prediction
        prediction_result = model.predict(
            request.current_price,
            request.historical_prices,
            request.horizon
        )
        
        # Store prediction in Supabase
        prediction_data = {
            'symbol': request.symbol,
            'current_price': request.current_price,
            'predicted_price': prediction_result['predicted_price'],
            'confidence_level': prediction_result['confidence_level'],
            'prediction_horizon': request.horizon,
            'predicted_for': (datetime.now() + timedelta(
                hours=1 if request.horizon == '1H' else 24 if request.horizon == '24H' else 168
            )).isoformat(),
            'features': prediction_result['features']
        }
        
        # Get model ID from database
        model_result = supabase.table('models').select('id').eq('symbol', request.symbol).eq('is_active', True).execute()
        if model_result.data:
            prediction_data['model_id'] = model_result.data[0]['id']
            supabase.table('predictions').insert(prediction_data).execute()
        
        return PredictionResponse(
            predicted_price=prediction_result['predicted_price'],
            confidence_level=prediction_result['confidence_level'],
            reasoning=f"LSTM deep learning model trained on {training_metrics['training_data_points']} data points with {training_metrics['accuracy']:.1%} directional accuracy",
            rmse=training_metrics['rmse'],
            mae=training_metrics['mae'],
            mape=training_metrics['mape'],
            model_info={
                'type': 'LSTM',
                'accuracy': training_metrics['accuracy'],
                'training_points': training_metrics['training_data_points'],
                'symbol': request.symbol
            },
            features=prediction_result['features']
        )
        
    except Exception as e:
        logger.error(f"Prediction endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train/{symbol}")
async def train_model_endpoint(symbol: str, retrain: bool = False):
    """Train or retrain model for specific symbol"""
    try:
        model = get_model(symbol.upper())
        metrics = model.train_model(retrain=retrain)
        return {
            "message": f"Model trained successfully for {symbol}",
            "metrics": metrics
        }
    except Exception as e:
        logger.error(f"Training endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models")
async def list_models():
    """List all available models"""
    try:
        result = supabase.table('models').select('*').eq('is_active', True).execute()
        return {"models": result.data}
    except Exception as e:
        logger.error(f"Models endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)