# Crypto LSTM Prediction Backend

This is a real deep learning backend that uses TensorFlow/Keras LSTM models to predict cryptocurrency prices based on actual historical data from CoinGecko API.

## Features

- **Real LSTM Neural Networks**: Uses TensorFlow/Keras for genuine deep learning predictions
- **Historical Data Training**: Fetches 2 years of historical data from CoinGecko for training
- **Technical Indicators**: Incorporates SMA, EMA, RSI, and volatility in feature engineering
- **Model Persistence**: Saves trained models and scalers for fast inference
- **Real Metrics**: Provides actual RMSE, MAE, MAPE, and directional accuracy
- **Supabase Integration**: Stores all models and predictions in your existing database

## Quick Start

### Option 1: Docker (Recommended)

1. **Clone and setup**:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your Supabase service role key
   ```

2. **Build and run**:
   ```bash
   docker-compose up -d
   ```

3. **Verify it's working**:
   ```bash
   curl http://localhost:8000/
   ```

### Option 2: Local Development

1. **Install Python 3.11+**:
   ```bash
   python -m pip install -r requirements.txt
   ```

2. **Set environment variables**:
   ```bash
   export SUPABASE_URL=https://tflmntmxnuahlzobwwzh.supabase.co
   export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. **Run the server**:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

### Option 3: Deploy to Railway/Render/DigitalOcean

1. **Create a new service** on your preferred platform
2. **Connect this repository** or upload the backend folder
3. **Set environment variables**:
   - `SUPABASE_URL=https://tflmntmxnuahlzobwwzh.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY=your_service_role_key`
4. **Deploy** using the provided Dockerfile

## Configuration

After deploying, update your Supabase Edge Function environment variable:
- Go to Supabase Dashboard > Edge Functions > Secrets
- Add: `LSTM_BACKEND_URL=https://your-deployed-backend-url.com`

## API Endpoints

### POST /predict
Generate LSTM prediction for a cryptocurrency:
```json
{
  "symbol": "BTC",
  "current_price": 45000,
  "historical_prices": [44000, 44500, 45000],
  "horizon": "24H"
}
```

Response includes real LSTM prediction with actual metrics:
```json
{
  "predicted_price": 46200.50,
  "confidence_level": 0.87,
  "reasoning": "LSTM deep learning model trained on 8760 data points with 89.2% directional accuracy",
  "rmse": 1250.30,
  "mae": 890.15,
  "mape": 2.1,
  "model_info": {
    "type": "LSTM",
    "accuracy": 0.892,
    "training_points": 8760
  },
  "features": {
    "current_price": 45000,
    "volatility": 0.024,
    "sma_20": 44800,
    "trend": "bullish"
  }
}
```

### POST /train/{symbol}
Train or retrain model for specific symbol:
```bash
curl -X POST http://localhost:8000/train/BTC?retrain=true
```

### GET /models
List all trained models with real metrics.

## Model Training

Models are trained automatically on first prediction request for each symbol. Training includes:
- **Data**: 2 years of hourly OHLCV data from CoinGecko
- **Features**: Price, SMA-20, EMA-12/26, RSI-14, volatility
- **Architecture**: 3-layer LSTM with dropout regularization
- **Evaluation**: 80/20 train/test split with real performance metrics

Training typically takes 5-15 minutes per symbol on first run.

## Monitoring

- Health check: `GET /`
- Model status: `GET /models`
- Logs: Check Docker logs or platform logs for training progress

## Troubleshooting

1. **"Backend not reachable"**: Check LSTM_BACKEND_URL in Supabase Edge Functions
2. **Training fails**: Ensure sufficient memory (2GB+) for TensorFlow
3. **API rate limits**: CoinGecko free tier has limits; consider pro plan for production

## Performance Notes

- First prediction per symbol requires model training (5-15 min)
- Subsequent predictions are fast (< 1 second)
- Models retrain automatically every 7 days
- Each model requires ~50-100MB storage