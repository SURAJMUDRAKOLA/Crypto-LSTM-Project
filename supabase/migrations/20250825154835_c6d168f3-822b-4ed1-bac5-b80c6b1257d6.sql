-- Create comprehensive database schema for crypto trading platform

-- Table for storing real-time market data from CoinGecko
CREATE TABLE public.market_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  current_price DECIMAL(20,8) NOT NULL,
  price_change_24h DECIMAL(20,8),
  price_change_percentage_24h DECIMAL(10,4),
  market_cap BIGINT,
  total_volume BIGINT,
  high_24h DECIMAL(20,8),
  low_24h DECIMAL(20,8),
  ath DECIMAL(20,8),
  ath_date TIMESTAMP WITH TIME ZONE,
  atl DECIMAL(20,8),
  atl_date TIMESTAMP WITH TIME ZONE,
  circulating_supply BIGINT,
  max_supply BIGINT,
  image_url TEXT,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for historical OHLCV data
CREATE TABLE public.ohlcv_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  open_price DECIMAL(20,8) NOT NULL,
  high_price DECIMAL(20,8) NOT NULL,
  low_price DECIMAL(20,8) NOT NULL,
  close_price DECIMAL(20,8) NOT NULL,
  volume DECIMAL(20,8) NOT NULL,
  market_cap BIGINT,
  timeframe TEXT NOT NULL DEFAULT '1h', -- 1m, 5m, 15m, 1h, 4h, 1d
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(symbol, timestamp, timeframe)
);

-- Table for technical indicators
CREATE TABLE public.technical_indicators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  timeframe TEXT NOT NULL DEFAULT '1h',
  -- Moving Averages
  sma_10 DECIMAL(20,8),
  sma_20 DECIMAL(20,8),
  sma_50 DECIMAL(20,8),
  sma_200 DECIMAL(20,8),
  ema_10 DECIMAL(20,8),
  ema_20 DECIMAL(20,8),
  ema_50 DECIMAL(20,8),
  -- RSI
  rsi_14 DECIMAL(5,2),
  -- MACD
  macd DECIMAL(20,8),
  macd_signal DECIMAL(20,8),
  macd_histogram DECIMAL(20,8),
  -- Bollinger Bands
  bb_upper DECIMAL(20,8),
  bb_middle DECIMAL(20,8),
  bb_lower DECIMAL(20,8),
  bb_bandwidth DECIMAL(10,4),
  -- Stochastic
  stoch_k DECIMAL(5,2),
  stoch_d DECIMAL(5,2),
  -- Additional indicators
  williams_r DECIMAL(5,2),
  atr DECIMAL(20,8),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(symbol, timestamp, timeframe)
);

-- Table for ML model training data
CREATE TABLE public.training_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  price DECIMAL(20,8) NOT NULL,
  volume DECIMAL(20,8) NOT NULL,
  features JSONB, -- Store technical indicators and other features
  target_price DECIMAL(20,8), -- Future price for training
  timeframe TEXT NOT NULL DEFAULT '1h',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for user portfolios
CREATE TABLE public.portfolios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'My Portfolio',
  description TEXT,
  total_value DECIMAL(20,8) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for portfolio holdings
CREATE TABLE public.holdings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  quantity DECIMAL(20,8) NOT NULL,
  average_buy_price DECIMAL(20,8) NOT NULL,
  total_invested DECIMAL(20,8) NOT NULL,
  current_value DECIMAL(20,8),
  profit_loss DECIMAL(20,8),
  profit_loss_percentage DECIMAL(10,4),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(portfolio_id, symbol)
);

-- Table for price alerts
CREATE TABLE public.price_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('above', 'below', 'percentage_change')),
  target_price DECIMAL(20,8),
  percentage_threshold DECIMAL(10,4),
  is_active BOOLEAN NOT NULL DEFAULT true,
  triggered_at TIMESTAMP WITH TIME ZONE,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhanced predictions table with more ML metrics
ALTER TABLE public.predictions ADD COLUMN IF NOT EXISTS rmse DECIMAL(20,8);
ALTER TABLE public.predictions ADD COLUMN IF NOT EXISTS mae DECIMAL(20,8);
ALTER TABLE public.predictions ADD COLUMN IF NOT EXISTS mape DECIMAL(10,4);
ALTER TABLE public.predictions ADD COLUMN IF NOT EXISTS features JSONB;
ALTER TABLE public.predictions ADD COLUMN IF NOT EXISTS actual_price DECIMAL(20,8);
ALTER TABLE public.predictions ADD COLUMN IF NOT EXISTS error_calculated BOOLEAN DEFAULT false;

-- Enhanced models table with more metadata
ALTER TABLE public.models ADD COLUMN IF NOT EXISTS model_type TEXT DEFAULT 'LSTM';
ALTER TABLE public.models ADD COLUMN IF NOT EXISTS hyperparameters JSONB;
ALTER TABLE public.models ADD COLUMN IF NOT EXISTS training_config JSONB;
ALTER TABLE public.models ADD COLUMN IF NOT EXISTS validation_metrics JSONB;
ALTER TABLE public.models ADD COLUMN IF NOT EXISTS feature_importance JSONB;

-- Create indexes for better performance
CREATE INDEX idx_market_data_symbol ON public.market_data(symbol);
CREATE INDEX idx_market_data_last_updated ON public.market_data(last_updated);
CREATE INDEX idx_ohlcv_symbol_timestamp ON public.ohlcv_data(symbol, timestamp);
CREATE INDEX idx_ohlcv_timeframe ON public.ohlcv_data(timeframe);
CREATE INDEX idx_technical_indicators_symbol_timestamp ON public.technical_indicators(symbol, timestamp);
CREATE INDEX idx_predictions_symbol_created ON public.predictions(symbol, created_at);
CREATE INDEX idx_training_data_symbol_timestamp ON public.training_data(symbol, timestamp);
CREATE INDEX idx_portfolios_user_id ON public.portfolios(user_id);
CREATE INDEX idx_holdings_portfolio_id ON public.holdings(portfolio_id);
CREATE INDEX idx_price_alerts_user_symbol ON public.price_alerts(user_id, symbol);

-- Enable Row Level Security
ALTER TABLE public.market_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ohlcv_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technical_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

-- Public read access for market data (no authentication required)
CREATE POLICY "Market data is publicly readable" ON public.market_data FOR SELECT USING (true);
CREATE POLICY "OHLCV data is publicly readable" ON public.ohlcv_data FOR SELECT USING (true);
CREATE POLICY "Technical indicators are publicly readable" ON public.technical_indicators FOR SELECT USING (true);
CREATE POLICY "Training data is publicly readable" ON public.training_data FOR SELECT USING (true);

-- User-specific policies for portfolios and alerts
CREATE POLICY "Users can view their own portfolios" ON public.portfolios FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own portfolios" ON public.portfolios FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own portfolios" ON public.portfolios FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own portfolios" ON public.portfolios FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their portfolio holdings" ON public.holdings FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.portfolios WHERE id = holdings.portfolio_id AND user_id = auth.uid())
);
CREATE POLICY "Users can manage their portfolio holdings" ON public.holdings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.portfolios WHERE id = holdings.portfolio_id AND user_id = auth.uid())
);

CREATE POLICY "Users can view their own alerts" ON public.price_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own alerts" ON public.price_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own alerts" ON public.price_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own alerts" ON public.price_alerts FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updating timestamps
CREATE TRIGGER update_portfolios_updated_at
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_holdings_updated_at
  BEFORE UPDATE ON public.holdings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();