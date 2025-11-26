
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface HeatmapData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  volatility: number;
}

interface MarketHeatmapProps {
  data: HeatmapData[];
}

const MarketHeatmap = ({ data }: MarketHeatmapProps) => {
  const getSentimentColor = (change: number) => {
    if (change > 5) return 'bg-green-500/80';
    if (change > 2) return 'bg-green-400/60';
    if (change > 0) return 'bg-green-300/40';
    if (change > -2) return 'bg-red-300/40';
    if (change > -5) return 'bg-red-400/60';
    return 'bg-red-500/80';
  };

  const getSize = (marketCap: number) => {
    const maxCap = Math.max(...data.map(d => d.marketCap));
    const ratio = marketCap / maxCap;
    const minSize = 120;
    const maxSize = 280;
    return minSize + (maxSize - minSize) * ratio;
  };

  return (
    <motion.div 
      className="glass-card rounded-xl p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Market Sentiment Heatmap
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Size represents market cap, color intensity shows 24h performance
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-3 justify-center">
          {data.map((coin, index) => {
            const size = getSize(coin.marketCap);
            const isPositive = coin.change24h >= 0;
            
            return (
              <motion.div
                key={coin.symbol}
                className={`
                  relative rounded-lg p-4 cursor-pointer transition-all duration-300
                  hover:scale-105 hover:z-10 flex flex-col items-center justify-center
                  ${getSentimentColor(coin.change24h)}
                  backdrop-blur-sm border border-white/20
                `}
                style={{ 
                  width: `${size}px`, 
                  height: `${size * 0.8}px`,
                  minWidth: '120px',
                  minHeight: '96px'
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                }}
              >
                <div className="text-center">
                  <div className="font-bold text-sm text-white mb-1">
                    {coin.symbol}
                  </div>
                  <div className="text-xs text-white/80 mb-2 truncate max-w-[100px]">
                    {coin.name}
                  </div>
                  <div className="font-semibold text-white mb-1">
                    ${coin.price.toLocaleString()}
                  </div>
                  <div className={`flex items-center justify-center gap-1 text-xs ${
                    isPositive ? 'text-green-100' : 'text-red-100'
                  }`}>
                    {isPositive ? 
                      <TrendingUp className="w-3 h-3" /> : 
                      <TrendingDown className="w-3 h-3" />
                    }
                    {isPositive ? '+' : ''}{coin.change24h.toFixed(2)}%
                  </div>
                  
                  {/* Volatility indicator */}
                  <div className="mt-2">
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-white/20 text-white border-white/30"
                    >
                      Vol: {coin.volatility.toFixed(1)}%
                    </Badge>
                  </div>
                </div>

                {/* Sentiment indicator */}
                <div className={`
                  absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white
                  ${coin.sentiment === 'bullish' ? 'bg-green-400' : 
                    coin.sentiment === 'bearish' ? 'bg-red-400' : 'bg-yellow-400'}
                `} />
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-muted-foreground">Strong Bullish</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-300 rounded"></div>
            <span className="text-muted-foreground">Bullish</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span className="text-muted-foreground">Neutral</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-300 rounded"></div>
            <span className="text-muted-foreground">Bearish</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-muted-foreground">Strong Bearish</span>
          </div>
        </div>
      </CardContent>
    </motion.div>
  );
};

export default MarketHeatmap;
