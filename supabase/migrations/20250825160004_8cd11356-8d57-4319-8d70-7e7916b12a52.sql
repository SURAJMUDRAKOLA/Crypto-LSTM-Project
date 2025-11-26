-- Fix the market_data table to add unique constraint on symbol
ALTER TABLE public.market_data ADD CONSTRAINT market_data_symbol_unique UNIQUE (symbol);

-- Also add unique constraint for OHLCV data
ALTER TABLE public.ohlcv_data DROP CONSTRAINT IF EXISTS ohlcv_data_symbol_timestamp_timeframe_key;
ALTER TABLE public.ohlcv_data ADD CONSTRAINT ohlcv_data_symbol_timestamp_timeframe_unique UNIQUE (symbol, timestamp, timeframe);

-- Add unique constraint for technical indicators  
ALTER TABLE public.technical_indicators DROP CONSTRAINT IF EXISTS technical_indicators_symbol_timestamp_timeframe_key;
ALTER TABLE public.technical_indicators ADD CONSTRAINT technical_indicators_symbol_timestamp_timeframe_unique UNIQUE (symbol, timestamp, timeframe);

-- Insert some initial market data so the homepage shows cryptocurrencies
INSERT INTO public.market_data (
  symbol, name, current_price, price_change_24h, price_change_percentage_24h, 
  market_cap, total_volume, high_24h, low_24h, ath, ath_date, atl, atl_date,
  circulating_supply, max_supply, image_url, last_updated
) VALUES 
('BTC', 'Bitcoin', 116764.00, 4101.96, 3.64, 2325008135619, 50051632973, 118000.00, 112000.00, 
 130000.00, '2024-03-14T00:00:00Z', 15476.00, '2022-11-21T00:00:00Z', 19700000, 21000000, 
 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', now()),
('ETH', 'Ethereum', 4801.39, 531.72, 12.45, 579443985225, 54357388798, 4900.00, 4200.00,
 4900.00, '2021-11-10T00:00:00Z', 81.85, '2022-06-18T00:00:00Z', 120300000, NULL,
 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', now()),
('SOL', 'Solana', 196.84, 14.19, 7.77, 106274919696, 8793779958, 200.00, 180.00,
 260.06, '2021-11-06T00:00:00Z', 8.14, '2022-12-29T00:00:00Z', 540000000, NULL,
 'https://assets.coingecko.com/coins/images/4128/large/solana.png', now()),
('ADA', 'Cardano', 0.925935, 0.061778, 7.15, 33740237715, 2863261132, 0.95, 0.85,
 3.10, '2021-09-02T00:00:00Z', 0.017354, '2020-03-13T00:00:00Z', 36400000000, 45000000000,
 'https://assets.coingecko.com/coins/images/975/large/cardano.png', now()),
('LINK', 'Chainlink', 27.03, 1.92, 7.66, 18302203681, 3195812521, 28.00, 25.00,
 52.88, '2021-05-10T00:00:00Z', 0.148183, '2020-03-13T00:00:00Z', 676957000, 1000000000,
 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png', now()),
('DOT', 'Polkadot', 4.08, 0.242188, 6.30, 6206045502, 390125599, 4.20, 3.80,
 55.00, '2021-11-04T00:00:00Z', 2.70, '2022-06-18T00:00:00Z', 1520000000, NULL,
 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png', now())
ON CONFLICT (symbol) DO UPDATE SET
  current_price = EXCLUDED.current_price,
  price_change_24h = EXCLUDED.price_change_24h,
  price_change_percentage_24h = EXCLUDED.price_change_percentage_24h,
  market_cap = EXCLUDED.market_cap,
  total_volume = EXCLUDED.total_volume,
  high_24h = EXCLUDED.high_24h,
  low_24h = EXCLUDED.low_24h,
  last_updated = EXCLUDED.last_updated;