# 🚀 Real LSTM Crypto Prediction Deployment Guide

Your cryptocurrency forecasting project has been upgraded with a **real TensorFlow/Keras LSTM deep learning backend**. No more fake predictions - every forecast now comes from actual neural networks trained on historical data!

## 📋 What Changed

✅ **Real Python Backend**: FastAPI server with TensorFlow/Keras LSTM models  
✅ **Actual Training**: Models train on 2 years of CoinGecko historical data  
✅ **Real Metrics**: RMSE, MAE, MAPE from actual model validation  
✅ **Technical Features**: SMA, EMA, RSI, volatility in feature engineering  
✅ **Model Persistence**: Trained models saved and reused for fast inference  
✅ **Updated Frontend**: Shows real predictions with confidence levels  

## 🎯 Quick Deployment (3 Steps)

### Step 1: Deploy the Python Backend

Choose your preferred deployment method:

#### Option A: Railway (Recommended - Free Tier Available)
1. Go to [Railway](https://railway.app) and create account
2. Click "Deploy from GitHub repo"
3. Upload the `backend/` folder or connect your repo
4. Railway will auto-detect the Dockerfile and deploy
5. Set environment variables:
   - `SUPABASE_URL`: `https://tflmntmxnuahlzobwwzh.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY`: (get from Supabase dashboard)
6. Copy the deployed URL (e.g., `https://your-app.railway.app`)

#### Option B: Render
1. Go to [Render](https://render.com) and create account
2. Create new "Web Service" from Docker
3. Upload the `backend/` folder
4. Set environment variables as above
5. Deploy and copy the URL

#### Option C: DigitalOcean App Platform
1. Go to [DigitalOcean](https://cloud.digitalocean.com/apps)
2. Create new app from Docker Hub or uploaded code
3. Use the provided Dockerfile
4. Configure environment variables
5. Deploy and get the URL

#### Option D: Local Development
```bash
cd backend
pip install -r requirements.txt
export SUPABASE_URL="https://tflmntmxnuahlzobwwzh.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Step 2: Configure Supabase Edge Function

1. Go to [Supabase Dashboard > Edge Functions](https://supabase.com/dashboard/project/tflmntmxnuahlzobwwzh/functions)
2. Click on "Edge Function Secrets"
3. Add new secret:
   - **Name**: `LSTM_BACKEND_URL`
   - **Value**: Your deployed backend URL (e.g., `https://your-app.railway.app`)

### Step 3: Test Real Predictions

1. Visit your Lovable app
2. Go to any coin's prediction panel
3. Click "Generate LSTM Prediction"
4. Watch as real deep learning models create predictions!

## 🔧 Backend Features

### Real Model Training
- **Data Source**: CoinGecko API (2 years hourly data)
- **Architecture**: 3-layer LSTM with dropout
- **Features**: Price, SMA-20, EMA-12/26, RSI-14, volatility
- **Training**: 80/20 split with early stopping
- **Validation**: Real RMSE, MAE, MAPE metrics

### API Endpoints
```
GET  /                     # Health check
POST /predict             # Generate LSTM prediction
POST /train/{symbol}      # Train model for symbol
GET  /models              # List all trained models
```

### Prediction Flow
1. **First Request**: Automatically trains model (5-15 min)
2. **Subsequent Requests**: Fast inference (< 1 second)  
3. **Auto-Retrain**: Models retrain weekly with fresh data
4. **Database Storage**: All predictions stored in Supabase

## 🧪 Testing the Integration

### Verify Backend Health
```bash
curl https://your-deployed-backend.com/
# Should return: {"message": "Crypto LSTM Prediction API", "version": "1.0.0"}
```

### Test Prediction Endpoint
```bash
curl -X POST https://your-deployed-backend.com/predict \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "BTC",
    "current_price": 45000,
    "historical_prices": [44000, 44500, 45000],
    "horizon": "24H"
  }'
```

### Check Supabase Integration
1. Generate prediction from frontend
2. Go to [Supabase Table Editor](https://supabase.com/dashboard/project/tflmntmxnuahlzobwwzh/editor)
3. Check `predictions` table for new real predictions
4. Check `models` table for actual training metrics

## 📊 Model Performance Tracking

The frontend now shows **real metrics** from actual model training:

- **Directional Accuracy**: % of correct price direction predictions
- **MAE**: Mean Absolute Error in USD
- **MAPE**: Mean Absolute Percentage Error
- **Training Data**: Number of actual samples used
- **Last Trained**: When model was last retrained

## 🔍 Troubleshooting

### "Backend not reachable" Error
1. Check `LSTM_BACKEND_URL` in Supabase Edge Function secrets
2. Verify your backend is running: visit the health check endpoint
3. Check backend logs for startup errors

### Model Training Fails
1. Ensure backend has sufficient memory (2GB+ recommended)
2. Check CoinGecko API rate limits
3. Review backend logs for TensorFlow errors

### Predictions Look Strange
1. First predictions per symbol require 5-15 min training
2. Check the model's MAE and MAPE metrics for accuracy expectations
3. Verify historical data quality in backend logs

## 🎉 Success!

You now have a **real deep learning cryptocurrency prediction system**! Every prediction comes from:

✅ Actual LSTM neural networks  
✅ Real historical price training data  
✅ Genuine TensorFlow/Keras models  
✅ Validated performance metrics  
✅ Technical indicator feature engineering  

No more fake predictions - this is the real deal! 🚀

---

**Support**: If you need help with deployment, check the backend logs first, then verify the Supabase configuration. The system is designed to be production-ready with proper error handling and monitoring.