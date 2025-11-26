-- Create models table to store LSTM model metadata
CREATE TABLE public.models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL, -- BTC, ETH, etc.
  model_type TEXT NOT NULL DEFAULT 'LSTM',
  version TEXT NOT NULL DEFAULT '1.0',
  accuracy DECIMAL(5,4), -- RMSE or accuracy percentage
  mae DECIMAL(10,2), -- Mean Absolute Error
  mape DECIMAL(5,2), -- Mean Absolute Percentage Error
  training_data_points INTEGER,
  last_trained_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create predictions table to store future price predictions
CREATE TABLE public.predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id UUID NOT NULL REFERENCES public.models(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  current_price DECIMAL(15,8) NOT NULL,
  predicted_price DECIMAL(15,8) NOT NULL,
  prediction_horizon TEXT NOT NULL, -- '1h', '24h', '7d', '30d', '1y'
  confidence_level DECIMAL(3,2) NOT NULL, -- 0.0 to 1.0
  predicted_for TIMESTAMP WITH TIME ZONE NOT NULL, -- when the prediction is for
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_evaluated BOOLEAN NOT NULL DEFAULT false
);

-- Create evaluations table to store prediction accuracy
CREATE TABLE public.evaluations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prediction_id UUID NOT NULL REFERENCES public.predictions(id) ON DELETE CASCADE,
  actual_price DECIMAL(15,8) NOT NULL,
  error_percentage DECIMAL(5,2) NOT NULL, -- |predicted - actual| / actual * 100
  absolute_error DECIMAL(15,8) NOT NULL, -- |predicted - actual|
  is_correct BOOLEAN NOT NULL, -- within acceptable threshold
  evaluated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (predictions are public data)
CREATE POLICY "Anyone can view models" ON public.models FOR SELECT USING (true);
CREATE POLICY "Anyone can view predictions" ON public.predictions FOR SELECT USING (true);
CREATE POLICY "Anyone can view evaluations" ON public.evaluations FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX idx_predictions_symbol_horizon ON public.predictions(symbol, prediction_horizon);
CREATE INDEX idx_predictions_created_at ON public.predictions(created_at DESC);
CREATE INDEX idx_models_symbol_active ON public.models(symbol, is_active);
CREATE INDEX idx_evaluations_prediction_id ON public.evaluations(prediction_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_models_updated_at
  BEFORE UPDATE ON public.models
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample LSTM models for each cryptocurrency
INSERT INTO public.models (name, symbol, accuracy, mae, mape, training_data_points, last_trained_at, is_active) VALUES
('Bitcoin LSTM v1.0', 'BTC', 0.8750, 2500.50, 3.25, 10000, now() - interval '2 hours', true),
('Ethereum LSTM v1.0', 'ETH', 0.8450, 85.75, 4.10, 8500, now() - interval '2 hours', true),
('Solana LSTM v1.0', 'SOL', 0.8200, 12.30, 5.80, 7000, now() - interval '2 hours', true),
('Cardano LSTM v1.0', 'ADA', 0.7950, 0.045, 6.20, 6500, now() - interval '2 hours', true),
('Chainlink LSTM v1.0', 'LINK', 0.8150, 1.85, 4.75, 5800, now() - interval '2 hours', true),
('Polkadot LSTM v1.0', 'DOT', 0.7850, 0.28, 7.15, 5200, now() - interval '2 hours', true);