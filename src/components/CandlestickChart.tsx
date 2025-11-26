
import { ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, Area, ReferenceLine, Bar } from 'recharts';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, LineChart, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface CandlestickData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  predicted?: number;
  confidence?: number;
  isFuture?: boolean;
}

interface CandlestickChartProps {
  data: CandlestickData[];
  selectedCoin: string;
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  predictions?: Array<{ time: string; price: number; confidence: number }>;
}

const CandlestickChart = ({ data, selectedCoin, timeframe, onTimeframeChange, predictions }: CandlestickChartProps) => {
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'area'>('candlestick');
  const [showPredictions, setShowPredictions] = useState(true);
  const [showVolume, setShowVolume] = useState(true);

  const timeframes = ['1D', '7D', '1M', '3M', '1Y'];

  // Custom candlestick component
  const Candlestick = (props: any) => {
    const { payload, x, y, width, height } = props;
    if (!payload) return null;

    const { open, high, low, close } = payload;
    const isGreen = close > open;
    const candleHeight = Math.abs(open - close) * (height / (payload.high - payload.low));
    const candleY = y + (payload.high - Math.max(open, close)) * (height / (payload.high - payload.low));
    
    return (
      <g>
        {/* Wick */}
        <line
          x1={x + width / 2}
          y1={y}
          x2={x + width / 2}
          y2={y + height}
          stroke={isGreen ? "#10b981" : "#ef4444"}
          strokeWidth={1}
        />
        {/* Body */}
        <rect
          x={x + width * 0.2}
          y={candleY}
          width={width * 0.6}
          height={candleHeight || 2}
          fill={isGreen ? "#10b981" : "#ef4444"}
          stroke={isGreen ? "#10b981" : "#ef4444"}
        />
      </g>
    );
  };

  const currentPrice = data[data.length - 1]?.close || 0;
  const previousPrice = data[data.length - 2]?.close || 0;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = (priceChange / previousPrice) * 100;

  return (
    <motion.div 
      className="glass-card rounded-xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-foreground">{selectedCoin} Price Chart</h3>
            <Badge variant={priceChange >= 0 ? "default" : "destructive"} className="flex items-center gap-1">
              {priceChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Advanced Technical Analysis with AI Predictions</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {timeframes.map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "outline"}
              size="sm"
              onClick={() => onTimeframeChange(tf)}
              className="text-xs gradient-button"
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={chartType === 'candlestick' ? "default" : "outline"}
          size="sm"
          onClick={() => setChartType('candlestick')}
          className="flex items-center gap-1"
        >
          <BarChart3 className="w-3 h-3" />
          Candlestick
        </Button>
        <Button
          variant={chartType === 'line' ? "default" : "outline"}
          size="sm"
          onClick={() => setChartType('line')}
          className="flex items-center gap-1"
        >
          <LineChart className="w-3 h-3" />
          Line
        </Button>
        <Button
          variant={chartType === 'area' ? "default" : "outline"}
          size="sm"
          onClick={() => setChartType('area')}
          className="flex items-center gap-1"
        >
          <Activity className="w-3 h-3" />
          Area
        </Button>
        <Button
          variant={showPredictions ? "default" : "outline"}
          size="sm"
          onClick={() => setShowPredictions(!showPredictions)}
        >
          AI Predictions
        </Button>
        <Button
          variant={showVolume ? "default" : "outline"}
          size="sm"
          onClick={() => setShowVolume(!showVolume)}
        >
          Volume
        </Button>
      </div>

      <div className="h-96 chart-container rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={data}
            margin={{ top: 10, right: 15, left: 10, bottom: 50 }}
          >
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis 
              dataKey="time" 
              stroke="#374151"
              fontSize={10}
              angle={-45}
              textAnchor="end"
              height={60}
              interval="preserveStartEnd"
              tick={{ fill: '#374151', fontSize: 10 }}
            />
            <YAxis 
              stroke="#374151"
              fontSize={12}
              domain={['dataMin * 0.95', 'dataMax * 1.05']}
              tick={{ fill: '#374151', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                backdropFilter: 'blur(16px)',
                fontSize: '14px',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}
              labelStyle={{
                color: 'hsl(var(--foreground))',
                fontWeight: '600',
                marginBottom: '8px'
              }}
              formatter={(value: any, name: string) => {
                if (name === 'predicted' || name === 'AI Prediction') {
                  return [
                    <span style={{ 
                      color: '#EF4444', 
                      fontWeight: '700',
                      fontSize: '15px',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}>
                      🤖 ${value?.toLocaleString()} (AI)
                    </span>, 
                    'LSTM Prediction'
                  ];
                }
                if (name === 'close' || name === 'Price') {
                  return [
                    <span style={{ 
                      color: '#3B82F6', 
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      💎 ${value?.toLocaleString()}
                    </span>, 
                    'Market Price'
                  ];
                }
                if (name === 'confidence') {
                  return [
                    <span style={{ 
                      color: '#6B7280', 
                      fontSize: '13px',
                      fontStyle: 'italic'
                    }}>
                      {value?.toFixed(1)}%
                    </span>, 
                    'AI Confidence'
                  ];
                }
                return [
                  <span style={{ color: '#1F2937' }}>
                    ${value?.toLocaleString()}
                  </span>, 
                  name
                ];
              }}
            />

            {/* Candlestick bodies */}
            {chartType === 'candlestick' && (
              <Bar dataKey="close" shape={<Candlestick />} />
            )}

            {/* Line chart */}
            {chartType === 'line' && (
              <Line
                type="monotone"
                dataKey="close"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                name="Price"
              />
            )}

            {/* Area chart */}
            {chartType === 'area' && (
              <Area
                type="monotone"
                dataKey="close"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#priceGradient)"
                name="Price"
              />
            )}

            {/* AI Predictions Overlay */}
            {showPredictions && (
              <>
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#EF4444"
                  strokeWidth={2}
                  strokeDasharray="8 4"
                  dot={{ 
                    fill: '#EF4444', 
                    strokeWidth: 2, 
                    r: 4
                  }}
                  name="AI Prediction"
                  connectNulls={true}
                />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  stroke="transparent"
                  fillOpacity={0.2}
                  fill="#EF4444"
                />
              </>
            )}

            {/* Current price reference line */}
            <ReferenceLine 
              y={currentPrice} 
              stroke="hsl(var(--primary))" 
              strokeDasharray="2 2" 
              label={{ value: `$${currentPrice.toLocaleString()}`, position: "insideTopRight" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Trading Insights */}
      <div className="mt-4 p-4 glass-card rounded-lg">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Trading Insights
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">24h High</p>
            <p className="font-semibold">${Math.max(...data.map(d => d.high)).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">24h Low</p>
            <p className="font-semibold">${Math.min(...data.map(d => d.low)).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Volume</p>
            <p className="font-semibold">${data[data.length - 1]?.volume.toLocaleString() || 0}</p>
          </div>
          <div>
            <p className="text-muted-foreground">AI Confidence</p>
            <p className="font-semibold text-accent">{data[data.length - 1]?.confidence || 85}%</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CandlestickChart;
