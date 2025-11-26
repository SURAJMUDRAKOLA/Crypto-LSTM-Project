import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Load Supabase env vars
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.');
}

// Create Supabase client
const supabase = createClient(
  SUPABASE_URL ?? '',
  SUPABASE_SERVICE_ROLE_KEY ?? ''
);

// ---------------- Technical Analysis Functions ----------------

function calculateSMA(prices: number[], period: number): number | null {
  if (prices.length < period) return null;
  const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
  return sum / period;
}

function calculateEMA(prices: number[], period: number): number | null {
  if (prices.length < period) return null;
  
  const multiplier = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }
  
  return ema;
}

function calculateRSI(prices: number[], period: number = 14): number | null {
  if (prices.length < period + 1) return null;
  
  let gains = 0;
  let losses = 0;
  
  // Calculate initial average gain and loss
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }
  
  let avgGain = gains / period;
  let avgLoss = losses / period;
  
  // Calculate RSI using smoothed averages
  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? -change : 0;
    
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }
  
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

function calculateMACD(prices: number[]): { macd: number; signal: number; histogram: number } | null {
  if (prices.length < 26) return null;
  
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  
  if (!ema12 || !ema26) return null;
  
  const macd = ema12 - ema26;
  
  // Calculate signal line (EMA of MACD)
  const macdValues: number[] = [];
  for (let i = 25; i < prices.length; i++) {
    const ema12_i = calculateEMA(prices.slice(0, i + 1), 12);
    const ema26_i = calculateEMA(prices.slice(0, i + 1), 26);
    if (ema12_i && ema26_i) {
      macdValues.push(ema12_i - ema26_i);
    }
  }
  
  const signal = calculateEMA(macdValues, 9) || 0;
  const histogram = macd - signal;
  
  return { macd, signal, histogram };
}

function calculateBollingerBands(
  prices: number[], 
  period: number = 20, 
  stdDev: number = 2
): { upper: number; middle: number; lower: number; bandwidth: number } | null {
  if (prices.length < period) return null;
  
  const sma = calculateSMA(prices, period);
  if (!sma) return null;
  
  const recentPrices = prices.slice(-period);
  const variance = recentPrices.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / period;
  const standardDeviation = Math.sqrt(variance);
  
  const upper = sma + (standardDeviation * stdDev);
  const lower = sma - (standardDeviation * stdDev);
  const bandwidth = (upper - lower) / sma * 100;
  
  return { upper, middle: sma, lower, bandwidth };
}

function calculateStochastic(
  highs: number[], 
  lows: number[], 
  closes: number[], 
  kPeriod: number = 14, 
  dPeriod: number = 3
): { k: number; d: number } | null {
  if (highs.length < kPeriod || lows.length < kPeriod || closes.length < kPeriod) return null;
  
  const recentHighs = highs.slice(-kPeriod);
  const recentLows = lows.slice(-kPeriod);
  const currentClose = closes[closes.length - 1];
  
  const highestHigh = Math.max(...recentHighs);
  const lowestLow = Math.min(...recentLows);
  
  const k = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
  
  // Simple moving average for %D
  const kValues: number[] = [];
  for (let i = kPeriod - 1; i < closes.length; i++) {
    const periodHighs = highs.slice(i - kPeriod + 1, i + 1);
    const periodLows = lows.slice(i - kPeriod + 1, i + 1);
    const hh = Math.max(...periodHighs);
    const ll = Math.min(...periodLows);
    kValues.push(((closes[i] - ll) / (hh - ll)) * 100);
  }
  
  const d = kValues.slice(-dPeriod).reduce((a, b) => a + b, 0) / dPeriod;
  
  return { k, d };
}

function calculateWilliamsR(
  highs: number[], 
  lows: number[], 
  closes: number[], 
  period: number = 14
): number | null {
  if (highs.length < period || lows.length < period || closes.length < period) return null;
  
  const recentHighs = highs.slice(-period);
  const recentLows = lows.slice(-period);
  const currentClose = closes[closes.length - 1];
  
  const highestHigh = Math.max(...recentHighs);
  const lowestLow = Math.min(...recentLows);
  
  return ((highestHigh - currentClose) / (highestHigh - lowestLow)) * -100;
}

function calculateATR(
  highs: number[], 
  lows: number[], 
  closes: number[], 
  period: number = 14
): number | null {
  if (highs.length < period + 1 || lows.length < period + 1 || closes.length < period + 1) return null;
  
  const trueRanges: number[] = [];
  for (let i = 1; i < highs.length; i++) {
    const tr1 = highs[i] - lows[i];
    const tr2 = Math.abs(highs[i] - closes[i - 1]);
    const tr3 = Math.abs(lows[i] - closes[i - 1]);
    trueRanges.push(Math.max(tr1, tr2, tr3));
  }
  
  return calculateSMA(trueRanges, period);
}

// ---------------- Main handler ----------------

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Safety: if env missing, fail fast
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Server misconfigured: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { symbol, timeframe = '1h' } = await req.json().catch(() => ({}));
    
    console.log('Calculating technical indicators for:', symbol || 'all symbols', 'timeframe:', timeframe);

    // Get OHLCV data
    let query = supabase
      .from('ohlcv_data')
      .select('*')
      .eq('timeframe', timeframe)
      .order('timestamp', { ascending: true });

    if (symbol) {
      query = query.eq('symbol', symbol);
    }

    const { data: ohlcvData, error: fetchError } = await query;

    if (fetchError) {
      throw new Error('Error fetching OHLCV data: ' + fetchError.message);
    }

    if (!ohlcvData || ohlcvData.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No OHLCV data available for technical analysis'
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Group data by symbol
    const symbolGroups: Record<string, any[]> = {};
    ohlcvData.forEach(row => {
      if (!symbolGroups[row.symbol]) {
        symbolGroups[row.symbol] = [];
      }
      symbolGroups[row.symbol].push(row);
    });

    const results: any[] = [];

    // Calculate indicators for each symbol
    for (const [sym, data] of Object.entries(symbolGroups)) {
      if (data.length < 50) continue; // Need enough data for calculations

      const closes = data.map(d => parseFloat(d.close_price));
      const highs = data.map(d => parseFloat(d.high_price));
      const lows = data.map(d => parseFloat(d.low_price));
      const volumes = data.map(d => parseFloat(d.volume));
      const latestTimestamp = data[data.length - 1].timestamp;

      // Calculate all technical indicators
      const sma10 = calculateSMA(closes, 10);
      const sma20 = calculateSMA(closes, 20);
      const sma50 = calculateSMA(closes, 50);
      const sma200 = calculateSMA(closes, 200);
      const ema10 = calculateEMA(closes, 10);
      const ema20 = calculateEMA(closes, 20);
      const ema50 = calculateEMA(closes, 50);
      const rsi = calculateRSI(closes);
      const macd = calculateMACD(closes);
      const bb = calculateBollingerBands(closes);
      const stoch = calculateStochastic(highs, lows, closes);
      const williamsR = calculateWilliamsR(highs, lows, closes);
      const atr = calculateATR(highs, lows, closes);

      const indicators = {
        symbol: sym,
        timestamp: latestTimestamp,
        timeframe,
        sma_10: sma10,
        sma_20: sma20,
        sma_50: sma50,
        sma_200: sma200,
        ema_10: ema10,
        ema_20: ema20,
        ema_50: ema50,
        rsi_14: rsi,
        macd: macd?.macd,
        macd_signal: macd?.signal,
        macd_histogram: macd?.histogram,
        bb_upper: bb?.upper,
        bb_middle: bb?.middle,
        bb_lower: bb?.lower,
        bb_bandwidth: bb?.bandwidth,
        stoch_k: stoch?.k,
        stoch_d: stoch?.d,
        williams_r: williamsR,
        atr: atr
      };

      // Store in database
      const { error: insertError } = await supabase
        .from('technical_indicators')
        .upsert(indicators, {
          onConflict: 'symbol,timestamp,timeframe',
          ignoreDuplicates: false,
        });

      if (insertError) {
        console.error('Error storing technical indicators for', sym, ':', insertError);
      } else {
        results.push(indicators);
      }
    }

    console.log('Successfully calculated technical indicators for', results.length, 'symbols');

    return new Response(JSON.stringify({
      success: true,
      data: results,
      message: `Successfully calculated technical indicators for ${results.length} symbols`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in calculate-technical-indicators:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message ?? 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
