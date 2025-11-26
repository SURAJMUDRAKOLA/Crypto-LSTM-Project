
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface ComparisonData {
  time: string;
  [key: string]: number | string; // Dynamic coin prices
}

interface CoinComparisonProps {
  data: ComparisonData[];
  availableCoins: Array<{
    symbol: string;
    name: string;
    color: string;
    change24h: number;
  }>;
}

const CoinComparison = ({ data, availableCoins }: CoinComparisonProps) => {
  const [selectedCoins, setSelectedCoins] = useState<string[]>(['BTC', 'ETH']);
  const [timeframe, setTimeframe] = useState('7D');
  const [viewType, setViewType] = useState<'absolute' | 'percentage'>('absolute');

  const timeframes = ['1D', '7D', '1M', '3M', '1Y'];

  const toggleCoin = (symbol: string) => {
    setSelectedCoins(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const getPercentageData = () => {
    if (viewType === 'absolute') return data;
    
    return data.map((item, index) => {
      const newItem: any = { time: item.time };
      
      selectedCoins.forEach(coin => {
        if (index === 0) {
          newItem[coin] = 0; // Base at 0%
        } else {
          const currentPrice = item[coin] as number;
          const basePrice = data[0][coin] as number;
          newItem[coin] = ((currentPrice - basePrice) / basePrice) * 100;
        }
      });
      
      return newItem;
    });
  };

  const chartData = getPercentageData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Cryptocurrency Comparison
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Compare multiple cryptocurrencies performance over time
          </p>
        </CardHeader>
        
        <CardContent>
          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Timeframe Selection */}
            <div className="flex gap-2">
              {timeframes.map((tf) => (
                <Button
                  key={tf}
                  variant={timeframe === tf ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe(tf)}
                  className="gradient-button"
                >
                  {tf}
                </Button>
              ))}
            </div>
            
            {/* View Type */}
            <div className="flex gap-2">
              <Button
                variant={viewType === 'absolute' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType('absolute')}
              >
                Absolute Price
              </Button>
              <Button
                variant={viewType === 'percentage' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType('percentage')}
              >
                Percentage Change
              </Button>
            </div>
          </div>

          {/* Coin Selection */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {availableCoins.map((coin) => {
              const isSelected = selectedCoins.includes(coin.symbol);
              const isPositive = coin.change24h >= 0;
              
              return (
                <motion.div
                  key={coin.symbol}
                  className={`
                    p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${isSelected 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50'
                    }
                  `}
                  onClick={() => toggleCoin(coin.symbol)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Checkbox checked={isSelected} onChange={() => {}} />
                    <span className="font-semibold">{coin.symbol}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {coin.name}
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${
                    isPositive ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {isPositive ? 
                      <TrendingUp className="w-3 h-3" /> : 
                      <TrendingDown className="w-3 h-3" />
                    }
                    {isPositive ? '+' : ''}{coin.change24h.toFixed(2)}%
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Chart */}
          <div className="h-80 chart-container rounded-lg p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => 
                    viewType === 'percentage' 
                      ? `${value.toFixed(1)}%` 
                      : `$${value.toLocaleString()}`
                  }
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                  formatter={(value: any, name: string) => [
                    viewType === 'percentage' 
                      ? `${value.toFixed(2)}%` 
                      : `$${value.toLocaleString()}`,
                    name
                  ]}
                />
                <Legend />
                
                {selectedCoins.map((coin, index) => {
                  const coinData = availableCoins.find(c => c.symbol === coin);
                  return (
                    <Line
                      key={coin}
                      type="monotone"
                      dataKey={coin}
                      stroke={coinData?.color || `hsl(${index * 60}, 70%, 50%)`}
                      strokeWidth={3}
                      dot={{ fill: coinData?.color || `hsl(${index * 60}, 70%, 50%)`, strokeWidth: 2, r: 4 }}
                      name={coin}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedCoins.map((coin) => {
              const coinData = availableCoins.find(c => c.symbol === coin);
              if (!coinData) return null;
              
              const isPositive = coinData.change24h >= 0;
              
              return (
                <div key={coin} className="glass-card p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{coin}</span>
                    <Badge variant={isPositive ? "default" : "destructive"}>
                      {isPositive ? '+' : ''}{coinData.change24h.toFixed(2)}%
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {coinData.name}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CoinComparison;
