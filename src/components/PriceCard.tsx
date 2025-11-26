
import { TrendingUp, TrendingDown } from "lucide-react";

interface PriceCardProps {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: string;
  marketCap: string;
  icon: string;
}

const PriceCard = ({ symbol, name, price, change24h, volume, marketCap, icon }: PriceCardProps) => {
  const isPositive = change24h >= 0;
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 crypto-glow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <h3 className="font-bold text-gray-800">{symbol}</h3>
            <p className="text-sm text-gray-500">{name}</p>
          </div>
        </div>
        <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          <span className="ml-1 font-medium">{isPositive ? '+' : ''}{change24h.toFixed(2)}%</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-2xl font-bold text-gray-800 price-pulse">
            ${price.toLocaleString()}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Volume (24h)</p>
            <p className="font-medium text-gray-800">{volume}</p>
          </div>
          <div>
            <p className="text-gray-500">Market Cap</p>
            <p className="font-medium text-gray-800">{marketCap}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCard;
