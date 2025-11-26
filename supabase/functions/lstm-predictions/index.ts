import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Load env vars securely
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Log if misconfigured
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.');
}

// Create Supabase client (service role, backend-only)
const supabase = createClient(
  SUPABASE_URL ?? '',
  SUPABASE_SERVICE_ROLE_KEY ?? ''
);

// Python LSTM Backend URL - set this in Supabase function secrets
const LSTM_BACKEND_URL = Deno.env.get('LSTM_BACKEND_URL') || 'http://localhost:8000';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Fail fast if env not set
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
    const { symbol, currentPrice, historicalPrices, horizon = '1H' } = await req.json();

    console.log(`Generating real LSTM prediction for ${symbol} with horizon ${horizon}`);

    // Fetch historical data from Supabase for better prediction context
    const { data: ohlcvData, error: ohlcvError } = await supabase
      .from('ohlcv_data')
      .select('close_price')
      .eq('symbol', symbol)
      .order('timestamp', { ascending: false })
      .limit(100);

    if (ohlcvError) {
      console.warn(`Could not fetch OHLCV data: ${ohlcvError.message}`);
    }

    // Prepare historical prices array - use OHLCV data if available, otherwise use provided data
    let fullHistoricalPrices = historicalPrices;
    if (ohlcvData && ohlcvData.length > 0) {
      const ohlcvPrices = ohlcvData.map((d) => parseFloat(d.close_price)).reverse();
      fullHistoricalPrices = [...ohlcvPrices, ...historicalPrices].slice(-100); // Keep last 100 data points
    }

    // Call Python LSTM Backend
    console.log(`Calling LSTM backend at ${LSTM_BACKEND_URL}/predict`);

    const predictionPayload = {
      symbol: symbol.toUpperCase(),
      current_price: currentPrice,
      historical_prices: fullHistoricalPrices,
      horizon: horizon,
    };

    const backendResponse = await fetch(`${LSTM_BACKEND_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(predictionPayload),
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error(`Backend error ${backendResponse.status}: ${errorText}`);
      throw new Error(`LSTM backend error: ${backendResponse.status} - ${errorText}`);
    }

    const lstmResult = await backendResponse.json();
    console.log(`LSTM prediction result:`, lstmResult);

    // The Python backend already stores the prediction in Supabase
    // We just need to fetch the latest prediction for this symbol to get the database record
    const { data: latestPrediction, error: predictionError } = await supabase
      .from('predictions')
      .select('*')
      .eq('symbol', symbol)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (predictionError) {
      console.warn(`Could not fetch stored prediction: ${predictionError.message}`);
    }

    console.log(
      `Real LSTM prediction for ${symbol}: $${lstmResult.predicted_price} (${(
        lstmResult.confidence_level * 100
      ).toFixed(1)}% confidence)`
    );

    return new Response(
      JSON.stringify({
        success: true,
        prediction:
          latestPrediction || {
            symbol,
            current_price: currentPrice,
            predicted_price: lstmResult.predicted_price,
            confidence_level: lstmResult.confidence_level,
            prediction_horizon: horizon,
            features: lstmResult.features,
          },
        model_info: lstmResult.model_info,
        reasoning: lstmResult.reasoning,
        metrics: {
          rmse: lstmResult.rmse,
          mae: lstmResult.mae,
          mape: lstmResult.mape,
        },
        features: lstmResult.features,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in LSTM predictions:', error);

    // Fallback: return error without fake prediction
    return new Response(
      JSON.stringify({
        error: `Real LSTM prediction failed: ${error.message}. Please ensure the Python backend is running at ${LSTM_BACKEND_URL}`,
        success: false,
        backend_url: LSTM_BACKEND_URL,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
