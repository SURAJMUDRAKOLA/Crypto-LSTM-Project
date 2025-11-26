
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CoinSelectorProps {
  selectedCoin: string;
  onCoinChange: (coin: string) => void;
}

const coins = [
  { symbol: "BTC", name: "Bitcoin", icon: "₿" },
  { symbol: "ETH", name: "Ethereum", icon: "Ξ" },
  { symbol: "BNB", name: "BNB", icon: "⬢" },
  { symbol: "XRP", name: "XRP", icon: "⟁" },
  { symbol: "SOL", name: "Solana", icon: "◎" },
  { symbol: "ADA", name: "Cardano", icon: "₳" },
  { symbol: "DOT", name: "Polkadot", icon: "●" },
  { symbol: "LINK", name: "Chainlink", icon: "⬢" },
];

const CoinSelector = ({ selectedCoin, onCoinChange }: CoinSelectorProps) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-lg crypto-glow">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Select Cryptocurrency</h3>
      <Select value={selectedCoin} onValueChange={onCoinChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose a cryptocurrency" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg">
          {coins.map((coin) => (
            <SelectItem key={coin.symbol} value={coin.symbol} className="hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{coin.icon}</span>
                <div>
                  <span className="font-medium">{coin.symbol}</span>
                  <span className="text-gray-500 ml-2">{coin.name}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CoinSelector;
