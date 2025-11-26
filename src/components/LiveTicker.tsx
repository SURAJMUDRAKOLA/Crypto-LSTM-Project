
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { SupabaseApiService } from "@/services/supabaseApi";

interface TickerData {
  symbol: string;
  price: number;
  change: number;
  icon: string;
}

const coinIcons: Record<string, string> = {
  BTC: "₿",
  ETH: "Ξ", 
  BNB: "⬢",
  XRP: "⟁",
  SOL: "◎",
  ADA: "₳",
  DOT: "●",
  LINK: "⬢"
};

const LiveTicker = () => {
  const [tickerData, setTickerData] = useState<TickerData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const marketData = await SupabaseApiService.fetchMarketData(['BTC', 'ETH', 'BNB', 'XRP', 'SOL', 'ADA', 'DOT', 'LINK']);
        const ticker = marketData.map(coin => ({
          symbol: coin.symbol,
          price: coin.current_price,
          change: coin.price_change_percentage_24h || 0,
          icon: coinIcons[coin.symbol] || "◦"
        }));
        setTickerData(ticker);
      } catch (error) {
        console.error('Error fetching ticker data:', error);
        // Fallback data
        setTickerData([
          { symbol: "BTC", price: 43250, change: 2.45, icon: "₿" },
          { symbol: "ETH", price: 2680, change: -1.23, icon: "Ξ" },
          { symbol: "BNB", price: 310, change: 1.87, icon: "⬢" },
          { symbol: "XRP", price: 0.52, change: -0.65, icon: "⟁" },
          { symbol: "SOL", price: 98.76, change: 5.23, icon: "◎" },
          { symbol: "ADA", price: 0.45, change: 3.87, icon: "₳" },
          { symbol: "DOT", price: 7.89, change: -2.14, icon: "●" },
          { symbol: "LINK", price: 14.56, change: 1.78, icon: "⬢" },
        ]);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-sm border-y border-white/10">
      <motion.div
        className="flex space-x-8 py-3"
        animate={{ x: [-100, -2000] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {[...tickerData, ...tickerData, ...tickerData].map((coin, index) => (
          <motion.div
            key={`${coin.symbol}-${index}`}
            className="flex items-center space-x-3 text-sm font-medium whitespace-nowrap"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-2xl">{coin.icon}</span>
            <span className="text-foreground font-bold">{coin.symbol}</span>
            <span className="text-foreground">${coin.price.toLocaleString()}</span>
            <div className={`flex items-center space-x-1 ${coin.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {coin.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{coin.change >= 0 ? '+' : ''}{coin.change.toFixed(2)}%</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default LiveTicker;
