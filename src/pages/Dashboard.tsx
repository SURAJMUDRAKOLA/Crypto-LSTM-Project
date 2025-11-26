
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import CandlestickChart from "@/components/CandlestickChart";
import MarketHeatmap from "@/components/MarketHeatmap";
import CoinComparison from "@/components/CoinComparison";
import AIChatWidget from "@/components/AIChatWidget";
import PredictionPanel from "@/components/PredictionPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Activity, BarChart3, Target, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useCryptoData } from "@/hooks/useCryptoData";

const Dashboard = () => {
  const [selectedCoin, setSelectedCoin] = useState("BTC");
  const [timeframe, setTimeframe] = useState("7D");
  const { cryptoData, loading } = useCryptoData(selectedCoin, timeframe);

  // Mock candlestick data (in real app, this would come from API)
  const generateCandlestickData = () => {
    const data = [];
    const basePrice = selectedCoin === 'BTC' ? 45000 : selectedCoin === 'ETH' ? 3000 : 1;
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      
      const open = basePrice * (1 + (Math.random() - 0.5) * 0.1);
      const volatility = Math.random() * 0.05;
      const high = open * (1 + volatility);
      const low = open * (1 - volatility);
      const close = low + Math.random() * (high - low);
      
      data.push({
        time: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        open: Math.round(open),
        high: Math.round(high),
        low: Math.round(low),
        close: Math.round(close),
        volume: Math.round(Math.random() * 1000000000),
        predicted: Math.round(close * (1 + (Math.random() - 0.5) * 0.02)),
        confidence: 75 + Math.random() * 20
      });
    }
    return data;
  };

  // Mock heatmap data
  const heatmapData = [
    { symbol: 'BTC', name: 'Bitcoin', price: 45000, change24h: 2.5, marketCap: 850000000000, volume: 25000000000, sentiment: 'bullish' as const, volatility: 3.2 },
    { symbol: 'ETH', name: 'Ethereum', price: 3000, change24h: -1.2, marketCap: 360000000000, volume: 15000000000, sentiment: 'neutral' as const, volatility: 4.1 },
    { symbol: 'SOL', name: 'Solana', price: 100, change24h: 5.8, marketCap: 45000000000, volume: 2000000000, sentiment: 'bullish' as const, volatility: 6.7 },
    { symbol: 'ADA', name: 'Cardano', price: 0.5, change24h: -3.1, marketCap: 18000000000, volume: 800000000, sentiment: 'bearish' as const, volatility: 5.3 },
    { symbol: 'DOT', name: 'Polkadot', price: 7, change24h: 1.8, marketCap: 9000000000, volume: 400000000, sentiment: 'neutral' as const, volatility: 4.9 },
    { symbol: 'LINK', name: 'Chainlink', price: 15, change24h: 4.2, marketCap: 8500000000, volume: 600000000, sentiment: 'bullish' as const, volatility: 5.8 }
  ];

  // Mock comparison data
  const comparisonData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    
    return {
      time: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      BTC: 45000 * (1 + Math.sin(i * 0.1) * 0.1 + (Math.random() - 0.5) * 0.05),
      ETH: 3000 * (1 + Math.sin(i * 0.15) * 0.08 + (Math.random() - 0.5) * 0.04),
      SOL: 100 * (1 + Math.sin(i * 0.2) * 0.12 + (Math.random() - 0.5) * 0.06),
      ADA: 0.5 * (1 + Math.sin(i * 0.18) * 0.15 + (Math.random() - 0.5) * 0.08),
      DOT: 7 * (1 + Math.sin(i * 0.12) * 0.1 + (Math.random() - 0.5) * 0.07),
      LINK: 15 * (1 + Math.sin(i * 0.16) * 0.09 + (Math.random() - 0.5) * 0.05)
    };
  });

  const availableCoins = [
    { symbol: 'BTC', name: 'Bitcoin', color: '#f7931a', change24h: 2.5 },
    { symbol: 'ETH', name: 'Ethereum', color: '#627eea', change24h: -1.2 },
    { symbol: 'SOL', name: 'Solana', color: '#9945ff', change24h: 5.8 },
    { symbol: 'ADA', name: 'Cardano', color: '#0033ad', change24h: -3.1 },
    { symbol: 'DOT', name: 'Polkadot', color: '#e6007a', change24h: 1.8 },
    { symbol: 'LINK', name: 'Chainlink', color: '#375bd2', change24h: 4.2 }
  ];

  const candlestickData = generateCandlestickData();
  const currentCrypto = cryptoData.find(crypto => crypto.symbol === selectedCoin);
  const currentPrediction = {
    price: candlestickData[candlestickData.length - 1]?.predicted || 45000,
    confidence: candlestickData[candlestickData.length - 1]?.confidence || 85,
    trend: (candlestickData[candlestickData.length - 1]?.predicted || 0) > 
           (candlestickData[candlestickData.length - 1]?.close || 0) ? 'bullish' as const : 'bearish' as const
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <Header />
      
      <main className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Advanced Trading Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time charts, AI predictions, and market analysis
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div 
          className="flex gap-4 mb-6 flex-wrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Select value={selectedCoin} onValueChange={setSelectedCoin}>
            <SelectTrigger className="w-48 glass-card">
              <SelectValue placeholder="Select cryptocurrency" />
            </SelectTrigger>
            <SelectContent>
              {availableCoins.map(coin => (
                <SelectItem key={coin.symbol} value={coin.symbol}>
                  {coin.symbol} - {coin.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass-card">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Advanced Charts
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Comparison
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              AI Predictions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <CandlestickChart
                  data={candlestickData}
                  selectedCoin={selectedCoin}
                  timeframe={timeframe}
                  onTimeframeChange={setTimeframe}
                />
              </div>
              <div className="space-y-6">
                <PredictionPanel selectedCoin={selectedCoin} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6 mt-6">
            <MarketHeatmap data={heatmapData} />
          </TabsContent>

          <TabsContent value="comparison" className="mt-6">
            <CoinComparison 
              data={comparisonData}
              availableCoins={availableCoins}
            />
          </TabsContent>

          <TabsContent value="predictions" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PredictionPanel selectedCoin={selectedCoin} />
              
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Prediction Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 glass-card rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Next 24h</p>
                        <p className="text-2xl font-bold text-primary">
                          ${currentPrediction.price.toLocaleString()}
                        </p>
                        <Badge variant={currentPrediction.trend === 'bullish' ? 'default' : 'destructive'}>
                          {currentPrediction.trend}
                        </Badge>
                      </div>
                      <div className="text-center p-4 glass-card rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Confidence</p>
                        <p className="text-2xl font-bold text-accent">
                          {currentPrediction.confidence}%
                        </p>
                        <Badge variant="outline">High Accuracy</Badge>
                      </div>
                    </div>
                    
                    <div className="p-4 glass-card rounded-lg">
                      <h4 className="font-semibold mb-2">AI Model Insights</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Pattern Recognition</span>
                          <Badge variant="outline">Strong Bullish</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Volume Analysis</span>
                          <Badge variant="outline">Increasing</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sentiment Score</span>
                          <Badge variant="outline">Positive</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* AI Chat Widget */}
        <AIChatWidget 
          selectedCoin={selectedCoin}
          currentPrediction={currentPrediction}
        />
      </main>
    </div>
  );
};

export default Dashboard;
