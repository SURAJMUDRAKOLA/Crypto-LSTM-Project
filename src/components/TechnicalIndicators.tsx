
import { Progress } from "@/components/ui/progress";

interface TechnicalIndicatorsProps {
  rsi: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
    current: number;
  };
}

const TechnicalIndicators = ({ rsi, macd, bollingerBands }: TechnicalIndicatorsProps) => {
  const getRSIColor = (value: number) => {
    if (value >= 70) return "text-red-600";
    if (value <= 30) return "text-green-600";
    return "text-yellow-600";
  };

  const getRSILabel = (value: number) => {
    if (value >= 70) return "Overbought";
    if (value <= 30) return "Oversold";
    return "Neutral";
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg crypto-glow">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Technical Indicators</h3>
      
      <div className="space-y-6">
        {/* RSI */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-700">RSI (14)</span>
            <span className={`font-bold ${getRSIColor(rsi)}`}>
              {rsi.toFixed(1)} - {getRSILabel(rsi)}
            </span>
          </div>
          <Progress value={rsi} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Oversold (30)</span>
            <span>Overbought (70)</span>
          </div>
        </div>

        {/* MACD */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-700 mb-3">MACD</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">MACD</p>
              <p className={`font-bold ${macd.macd >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {macd.macd.toFixed(4)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Signal</p>
              <p className={`font-bold ${macd.signal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {macd.signal.toFixed(4)}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Histogram</p>
              <p className={`font-bold ${macd.histogram >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {macd.histogram.toFixed(4)}
              </p>
            </div>
          </div>
        </div>

        {/* Bollinger Bands */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-700 mb-3">Bollinger Bands</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Upper Band</span>
              <span className="font-bold text-gray-800">${bollingerBands.upper.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Middle Band (SMA)</span>
              <span className="font-bold text-gray-800">${bollingerBands.middle.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Lower Band</span>
              <span className="font-bold text-gray-800">${bollingerBands.lower.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-500">Current Price</span>
              <span className="font-bold text-blue-600">${bollingerBands.current.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalIndicators;
