
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { SupabaseApiService } from '@/services/supabaseApi';
import { useSupabasePredictions } from '@/hooks/useSupabasePredictions';

interface PriceChartProps {
  data: Array<{
    time: string;
    price?: number;
    predicted?: number;
  }>;
  selectedCoin: string;
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

const PriceChart = ({ data, selectedCoin, timeframe, onTimeframeChange }: PriceChartProps) => {
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  const [combinedData, setCombinedData] = useState(data);
  const [realTimeData, setRealTimeData] = useState<any[]>([]);
  const [predictionAccuracy, setPredictionAccuracy] = useState<{correct: number, incorrect: number}>({correct: 0, incorrect: 0});
  const { predictions } = useSupabasePredictions(selectedCoin);

  const timeframes = ['1H', '1D', '7D', '1M', '3M', '1Y'];

  // Fetch real-time market data and future predictions
  useEffect(() => {
    console.log(`PriceChart: Timeframe changed to ${timeframe} for ${selectedCoin}`);
    
    const fetchRealTimeData = async () => {
      try {
        // Get current market data
        const marketData = await SupabaseApiService.getMarketData([selectedCoin]);
        const currentPrice = marketData[0]?.current_price || 0;
        
        // Generate future predictions based on timeframe with proper logging
        console.log(`Generating predictions for ${selectedCoin} with timeframe ${timeframe}`);
        const futurePredictions = await SupabaseApiService.generateFuturePredictions(selectedCoin, timeframe);
        console.log(`Received ${futurePredictions.length} predictions for ${timeframe}`);
        
        // Enhanced logging for 3M timeframe
        if (timeframe === '3M') {
          console.log('3M timeframe - First 5 predictions:', futurePredictions.slice(0, 5));
          console.log('3M timeframe - Last 5 predictions:', futurePredictions.slice(-5));
        }
        
        // Use fresh data from parent, don't mix with old data
        const baseData = [...data];
        
        // Update the last historical point with current price if needed
        if (baseData.length > 0 && currentPrice > 0) {
          const lastPoint = baseData[baseData.length - 1];
          // Only update if the last point doesn't have a price or the price is outdated
          if (!lastPoint.price || Math.abs(lastPoint.price - currentPrice) > currentPrice * 0.01) {
            // Update the last historical point with current price
            baseData[baseData.length - 1] = {
              ...lastPoint,
              price: currentPrice
            };
          }
        }

        // Prepare future prediction data - use all predictions for longer timeframes
        let maxPredictions = 20; // Default for short timeframes
        switch (timeframe) {
          case '1H':
            maxPredictions = 144; // Show more granular data - every 5 minutes for 12 hours
            break;
          case '1D':
            maxPredictions = 24; // 24 hours
            break;
          case '7D':
            maxPredictions = 42; // 7 days with multiple points per day (every 4 hours)
            break;
          case '1M':
            maxPredictions = 120; // 30 days every 6 hours
            break;
          case '3M':
            maxPredictions = 180; // 90 days every 12 hours (full 3 months)
            break;
          case '1Y':
            maxPredictions = 52; // 52 weeks
            break;
        }
        
        const futureData = futurePredictions.slice(0, maxPredictions).map(pred => ({
          time: pred.time,
          price: undefined, // No actual price for future
          predicted: pred.price,
          confidence: pred.confidence
        }));

        // Get real-time actual values for comparison with predictions
        const actualData = await SupabaseApiService.getActualVsPredicted(selectedCoin, timeframe);
        
        // Create combined data with only actual and predicted values (simplified two-color system)
        let combined = [...baseData];
        
        if (futureData.length > 0) {
          // Add future predictions
          combined = [...baseData, ...futureData];
        }
        
        // Process actual vs predicted data - replace predictions with actual values
        if (actualData && actualData.length > 0) {
          console.log('Processing actual data:', actualData.length, 'points');
          console.log('Combined data before processing:', combined.length, 'points');
          
          let replacedCount = 0;
          actualData.forEach(actual => {
            // Find the closest time match (since time formats might differ slightly)
            const existingIndex = combined.findIndex(item => {
              // Exact match first
              if (item.time === actual.time) return true;
              
              // Try to match by parsing dates for approximate time matching
              try {
                const itemTime = new Date(item.time).getTime();
                const actualTime = new Date(actual.time).getTime();
                const timeDiff = Math.abs(itemTime - actualTime);
                // Match if within 30 minutes (for some time format tolerance)
                return timeDiff <= 30 * 60 * 1000;
              } catch {
                return false;
              }
            });
            
            if (existingIndex >= 0) {
              // Replace predicted with actual value and mark accuracy
              const originalPredicted = combined[existingIndex].predicted;
              const wasCorrect = originalPredicted ? 
                (Math.abs(originalPredicted - actual.price) / actual.price < 0.05) : 
                true;
              
              console.log(`Replacing prediction at index ${existingIndex}, time: ${combined[existingIndex].time}, predicted: ${originalPredicted}, actual: ${actual.price}`);
              
              // Overwrite the existing point with actual data
              combined[existingIndex] = {
                time: combined[existingIndex].time, // Keep original time format
                price: actual.price, // Replace with actual price
                predicted: undefined, // Clear prediction
                isActual: true,
                predictionAccuracy: originalPredicted ? (wasCorrect ? 'correct' : 'incorrect') : null,
                confidence: combined[existingIndex].confidence // Keep confidence if it was there
              };
              replacedCount++;
            }
            // Don't add new points - only replace existing predictions
          });
          
          console.log(`Replaced ${replacedCount} predictions with actual data`);
          console.log('Combined data after processing:', combined.length, 'points');
          console.log('Predictions remaining:', combined.filter(item => item.predicted).length, 'points');
        }
        
        // Create seamless transition by ensuring data continuity
        combined.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
        
        // Find the transition point between actual and predicted data
        const transitionIndex = combined.findIndex(item => !item.price && item.predicted);
        
        if (transitionIndex > 0) {
          const lastActualPrice = combined[transitionIndex - 1]?.price;
          const firstPredictedPrice = combined[transitionIndex]?.predicted;
          
          if (lastActualPrice && firstPredictedPrice) {
            // Create a bridge point that connects actual to predicted seamlessly
            combined[transitionIndex] = {
              ...combined[transitionIndex],
              price: lastActualPrice, // Start predicted area from last actual price
              predicted: firstPredictedPrice // Keep the prediction value
            };
          }
        }
        
        // Calculate prediction accuracy
        const correct = combined.filter(item => item.predictionAccuracy === 'correct').length;
        const incorrect = combined.filter(item => item.predictionAccuracy === 'incorrect').length;
        setPredictionAccuracy({correct, incorrect});
        
        // Enhanced logging for 3M timeframe
        if (timeframe === '3M') {
          console.log(`3M timeframe - maxPredictions: ${maxPredictions}`);
          console.log(`3M timeframe - futureData length: ${futureData.length}`);
          console.log(`3M timeframe - baseData length: ${baseData.length}`);
          console.log(`3M timeframe - combined length: ${combined.length}`);
          console.log('3M timeframe - Sample future data:', futureData.slice(0, 3));
          console.log(`Prediction accuracy - Correct: ${correct}, Incorrect: ${incorrect}`);
        }
        
        setCombinedData(combined);
        setRealTimeData(futureData);
        
      } catch (error) {
        console.error('Error fetching real-time data:', error);
        // Fallback to just the parent data
        setCombinedData(data);
        setRealTimeData([]);
      }
    };

    // Clear existing data first, then fetch new data
    setCombinedData(data);
    setRealTimeData([]);
    
    fetchRealTimeData();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchRealTimeData, 30000);
    return () => clearInterval(interval);
  }, [selectedCoin, timeframe, data, predictions]);

  return (
    <div className="bg-card rounded-xl p-6 shadow-lg crypto-glow border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground">{selectedCoin} Real-Time & LSTM Predictions</h3>
          <p className="text-sm text-muted-foreground">Live Price Data with AI-Powered Forecasts</p>
          {realTimeData.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-green-600 dark:text-green-400">
                ● Live • {realTimeData.length} future predictions loaded
              </p>
              {(predictionAccuracy.correct > 0 || predictionAccuracy.incorrect > 0) && (
                <div className="flex space-x-4 text-xs">
                  <span className="text-green-600 dark:text-green-400">
                    ✓ Correct: {predictionAccuracy.correct}
                  </span>
                  <span className="text-red-600 dark:text-red-400">
                    ✗ Incorrect: {predictionAccuracy.incorrect}
                  </span>
                  <span className="text-muted-foreground">
                    Accuracy: {((predictionAccuracy.correct / (predictionAccuracy.correct + predictionAccuracy.incorrect)) * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          {timeframes.map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "outline"}
              size="sm"
              onClick={() => onTimeframeChange(tf)}
              className="text-xs"
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex space-x-2 mb-4">
        <Button
          variant={chartType === 'area' ? "default" : "outline"}
          size="sm"
          onClick={() => setChartType('area')}
        >
          Area Chart
        </Button>
        <Button
          variant={chartType === 'line' ? "default" : "outline"}
          size="sm"
          onClick={() => setChartType('line')}
        >
          Line Chart
        </Button>
      </div>

      <div className="h-80 chart-container rounded-lg bg-card">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart 
              data={combinedData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.7}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  color: 'hsl(var(--card-foreground))'
                }}
              />
              {/* Actual Price Area (Historical + Live) */}
              <Area
                type="monotone"
                dataKey="price"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={0.8}
                fill="url(#colorActual)"
                name="Actual Price"
                connectNulls={true}
              />
              {/* LSTM Predictions Area (Future Only) */}
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="#F59E0B"
                strokeWidth={2}
                strokeDasharray="5 5"
                fillOpacity={0.6}
                fill="url(#colorPredicted)"
                name="LSTM Prediction"
                connectNulls={true}
              />
            </AreaChart>
          ) : (
            <LineChart 
              data={combinedData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  color: 'hsl(var(--card-foreground))'
                }}
              />
              {/* Actual Price Line (Historical + Live) */}
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ 
                  fill: (props: any) => {
                    const accuracy = props.payload?.predictionAccuracy;
                    const isActual = props.payload?.isActual;
                    if (isActual && accuracy) {
                      return accuracy === 'correct' ? '#10B981' : '#EF4444';
                    }
                    return '#3B82F6';
                  }, 
                  strokeWidth: 2, 
                  r: (props: any) => props.payload?.isActual ? 6 : 4
                }}
                name="Actual Price"
                connectNulls={true}
              />
              {/* LSTM Predictions Line (Future Only) */}
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#F59E0B"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                name="LSTM Prediction"
                connectNulls={true}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
