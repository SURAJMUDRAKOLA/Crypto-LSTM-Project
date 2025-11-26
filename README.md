🚀 Crypto LSTM Price Prediction Platform
AI-Powered Deep Learning System for Real-Time Cryptocurrency Forecasting

A full-stack ML-driven platform that predicts cryptocurrency prices using LSTM neural networks, real market data, technical indicators, and an interactive modern UI.

🧠 About the Project

This application leverages deep learning (LSTM) and real-time market data to provide short-term cryptocurrency price forecasts along with performance accuracy metrics.
The system includes:

A FastAPI ML backend running TensorFlow/Keras models

A Supabase database for predictions & model logs

A React + TypeScript + Vite frontend with advanced charting and animations

Supabase Edge Functions connecting UI to backend securely

✨ Key Features

🔮 Real LSTM neural network price predictions

⚡ Fast inference with backend auto-training

📊 Live price charts with real technical indicators (SMA, EMA, RSI, Volatility)

📈 Real evaluation metrics — RMSE / MAE / MAPE / Directional Accuracy

📁 Model persistence & weekly retraining automation

🌓 Modern UI with Dark/Light mode

🌍 Real-time crypto market integrations

🛡 Secure architecture using Supabase Edge Functions

🛠 Tech Stack
Category	Technologies
Frontend	React, TypeScript, Vite, Tailwind CSS, shadcn-ui, Recharts
Backend	FastAPI, Python, TensorFlow, Scikit-Learn, Uvicorn
Database & Infra	Supabase, SQL, Edge Functions
Deployment	Vercel (Frontend), Railway / Render (Backend)
Others	Docker-ready, REST API, CI/CD support

🧩 Project Structure
/frontend         → React UI (Vite + TS + Tailwind + charts)
/backend          → FastAPI (TensorFlow LSTM Backend)
/supabase         → Edge functions + database migrations

⚙️ Local Development Setup
📍 Frontend
git clone <YOUR_REPOSITORY_URL>
cd <PROJECT_FOLDER>
npm install
npm run dev

📍 Backend (Python LSTM API)
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000

☁️ Deployment Guide
🌐 Frontend Deployment (Vercel)
    npm run build
    vercel deploy

🤖 Backend Deployment (Railway / Render Recommended)

Deploy /backend via Docker auto-detect
Add Environment Variables:
SUPABASE_URL=<your_supabase_url>
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>


Copy deployed backend URL

🔗 Supabase Edge Function

Add Secret:

LSTM_BACKEND_URL = https://your-backend-url

🔌 API Routes
GET   /                 → Health check
POST  /predict          → Generate LSTM prediction
POST  /train/{symbol}   → Train model for coin
GET   /models           → List trained models

🔍 Model Performance
Metric	Description
RMSE	Root Mean Square Error
MAE	Mean Absolute Error
MAPE	Accuracy percentage
Direction Accuracy	Correct movement predictions %
🖼 Screenshots & Preview

(Add screenshots here when deployed)

/readme-assets/dashboard-preview.png
/readme-assets/prediction-panel.png
/readme-assets/live-charts.png

🤝 Contributing

Contributions are welcome!
Open an issue or submit a PR for improvements.

📜 License

MIT License

⭐ Support

If this project helped you, please star ⭐ the repository — it motivates further development!

💫 Future Enhancements

NLP-based sentiment analysis (Twitter / Reddit)

Multi-model ensemble comparison

Portfolio prediction recommendations

Live alert WebSocket system

🚀 Ready to build, deploy & scale.
Need help with backend deployment or Vercel setup?

Just say “Help deploy backend” or “Help deploy frontend to Vercel”.