
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import GlassmorphismCard from "./GlassmorphismCard";

interface ModernPriceCardProps {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: string;
  marketCap: string;
  icon: string;
  index?: number;
}

const ModernPriceCard = ({ 
  symbol, 
  name, 
  price, 
  change24h, 
  volume, 
  marketCap, 
  icon,
  index = 0 
}: ModernPriceCardProps) => {
  const isPositive = change24h >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <GlassmorphismCard className="p-6 group cursor-pointer">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div
              className="relative"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                {icon}
              </div>
              <motion.div
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-sm"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            <div>
              <h3 className="font-bold text-foreground text-lg">{symbol}</h3>
              <p className="text-sm text-muted-foreground">{name}</p>
            </div>
          </div>
          
          <motion.div 
            className={`flex items-center space-x-1 px-3 py-1 rounded-full ${
              isPositive 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="font-medium text-sm">
              {isPositive ? '+' : ''}{change24h.toFixed(2)}%
            </span>
          </motion.div>
        </div>
        
        <div className="space-y-4">
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-3xl font-bold text-foreground mb-1">
              ${price.toLocaleString()}
            </p>
            <div className="flex items-center justify-center space-x-1 text-muted-foreground">
              <Activity className="w-3 h-3" />
              <span className="text-xs">Live Price</span>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <motion.div 
              className="bg-white/5 rounded-lg p-3 text-center"
              whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              <p className="text-muted-foreground mb-1">Volume (24h)</p>
              <p className="font-semibold text-foreground">{volume}</p>
            </motion.div>
            <motion.div 
              className="bg-white/5 rounded-lg p-3 text-center"
              whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              <p className="text-muted-foreground mb-1">Market Cap</p>
              <p className="font-semibold text-foreground">{marketCap}</p>
            </motion.div>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </GlassmorphismCard>
    </motion.div>
  );
};

export default ModernPriceCard;
