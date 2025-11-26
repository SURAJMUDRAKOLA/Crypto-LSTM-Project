-- Insert BNB data into market_data table
INSERT INTO market_data (symbol, name, current_price, price_change_24h, price_change_percentage_24h, market_cap, total_volume, high_24h, low_24h, ath, ath_date, atl, atl_date, circulating_supply, max_supply, image_url) 
VALUES ('BNB', 'BNB', 695.50, 15.20, 2.24, 102000000000, 2100000000, 720.00, 675.00, 720.00, NOW(), 675.00, NOW(), 147000000, 200000000, 'https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png')
ON CONFLICT (symbol) DO UPDATE SET 
  current_price = EXCLUDED.current_price,
  price_change_24h = EXCLUDED.price_change_24h,
  price_change_percentage_24h = EXCLUDED.price_change_percentage_24h,
  market_cap = EXCLUDED.market_cap,
  total_volume = EXCLUDED.total_volume,
  high_24h = EXCLUDED.high_24h,
  low_24h = EXCLUDED.low_24h,
  last_updated = NOW();