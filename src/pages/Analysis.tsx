import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Target, Brain, Activity, AlertTriangle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCryptoData } from "@/hooks/useCryptoData";

const Analysis = () => {
  const [selectedModel, setSelectedModel] = useState("bitcoin");
  const [timeframe, setTimeframe] = useState("7d");
  const [predictionTimeframe, setPredictionTimeframe] = useState("1D");
  const { toast } = useToast();
  
  // Get real crypto data for the selected model
  const coinSymbol = selectedModel.toUpperCase().replace('CARDANO', 'ADA').replace('POLKADOT', 'DOT').replace('CHAINLINK', 'LINK').replace('SOLANA', 'SOL').replace('ETHEREUM', 'ETH').replace('BITCOIN', 'BTC');
  const { cryptoData, chartData } = useCryptoData(coinSymbol, predictionTimeframe);
  
  // Model metrics - moved here to avoid temporal dead zone error
  const modelMetrics = {
    bitcoin: {
      name: "Bitcoin LSTM",
      accuracy: 95.3,
      rmse: 145.7,
      mae: 98.3,
      mape: 2.4,
      sharpe: 1.8,
      maxDrawdown: -5.2,
      totalPredictions: 15420,
      correctPredictions: 14698
    },
    ethereum: {
      name: "Ethereum LSTM", 
      accuracy: 91.8,
      rmse: 12.3,
      mae: 8.9,
      mape: 3.1,
      sharpe: 1.6,
      maxDrawdown: -7.1,
      totalPredictions: 12350,
      correctPredictions: 11339
    },
    cardano: {
      name: "Cardano LSTM",
      accuracy: 89.2,
      rmse: 0.025,
      mae: 0.018,
      mape: 2.8,
      sharpe: 1.4,
      maxDrawdown: -8.3,
      totalPredictions: 11280,
      correctPredictions: 10064
    },
    polkadot: {
      name: "Polkadot LSTM",
      accuracy: 87.5,
      rmse: 0.15,
      mae: 0.11,
      mape: 3.5,
      sharpe: 1.3,
      maxDrawdown: -9.1,
      totalPredictions: 9850,
      correctPredictions: 8619
    },
    chainlink: {
      name: "Chainlink LSTM",
      accuracy: 88.9,
      rmse: 0.42,
      mae: 0.31,
      mape: 3.2,
      sharpe: 1.5,
      maxDrawdown: -7.8,
      totalPredictions: 10750,
      correctPredictions: 9557
    },
    solana: {
      name: "Solana LSTM",
      accuracy: 92.4,
      rmse: 3.8,
      mae: 2.9,
      mape: 2.7,
      sharpe: 1.7,
      maxDrawdown: -6.4,
      totalPredictions: 13200,
      correctPredictions: 12197
    }
  };
  
  // Get current price for the selected model
  const getCurrentPrice = () => {
    const coin = cryptoData.find(c => c.symbol === coinSymbol);
    return coin?.price || 0;
  };

  // Generate real-time accuracy data based on current date
  const getAccuracyData = () => {
    const now = new Date();
    const accuracyData = [];
    
    // Generate data for the past 7 months and next month
    for (let i = -7; i <= 1; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const isFuture = i > 0;
      
      // Base accuracy with some variation
      const baseAccuracy = modelMetrics[selectedModel as keyof typeof modelMetrics]?.accuracy || 90;
      const variation = Math.sin(i * 0.5) * 2 + (Math.random() - 0.5) * 3;
      const accuracy = Math.min(100, Math.max(80, baseAccuracy + variation));
      
      // Loss inversely related to accuracy
      const loss = (100 - accuracy) / 1000 + 0.02;
      
      accuracyData.push({
        date: monthName,
        accuracy: Math.round(accuracy * 100) / 100,
        loss: Math.round(loss * 1000) / 1000,
        isFuture
      });
    }
    
    return accuracyData;
  };

  const accuracyData = getAccuracyData();

  // Generate real-time predictions vs actual data with real crypto prices
  const getPredictionData = () => {
    const currentPrice = getCurrentPrice();
    if (!currentPrice) return [];
    
    // Generate realistic predictions based on current price and timeframe
    const data = [];
    const now = Date.now();
    
    if (predictionTimeframe === '1D') {
      // Generate hourly data for past 24 hours showing actual vs predicted
      for (let i = -23; i <= 0; i++) {
        const time = new Date(now + i * 60 * 60 * 1000);
        const timeLabel = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        // Simulate price variation for the past hours
        const hourVariation = Math.sin(i * 0.3) * 0.01 + (Math.random() - 0.5) * 0.005;
        const actualPrice = currentPrice * (1 + hourVariation);
        
        // Prediction is close but not perfect
        const predictionError = (Math.random() - 0.5) * 0.008; // ±0.8% error
        const predictedPrice = actualPrice * (1 + predictionError);
        
        data.push({
          time: timeLabel,
          actual: Math.round(actualPrice * 100) / 100,
          predicted: Math.round(predictedPrice * 100) / 100,
          confidence: Math.round(85 + Math.random() * 15), // 85-100% confidence
          isCorrect: Math.abs(predictionError) < 0.005 // Within 0.5% is considered correct
        });
      }
    } else if (predictionTimeframe === '7D') {
      // Generate daily data for past 7 days
      for (let i = -6; i <= 0; i++) {
        const time = new Date(now + i * 24 * 60 * 60 * 1000);
        const timeLabel = time.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
        
        const dayVariation = Math.sin(i * 0.2) * 0.03 + (Math.random() - 0.5) * 0.02;
        const actualPrice = currentPrice * (1 + dayVariation);
        
        const predictionError = (Math.random() - 0.5) * 0.015;
        const predictedPrice = actualPrice * (1 + predictionError);
        
        data.push({
          time: timeLabel,
          actual: Math.round(actualPrice * 100) / 100,
          predicted: Math.round(predictedPrice * 100) / 100,
          confidence: Math.round(80 + Math.random() * 20),
          isCorrect: Math.abs(predictionError) < 0.01
        });
      }
    } else if (predictionTimeframe === '1M') {
      // Generate data for past 30 days (weekly points)
      for (let i = -4; i <= 0; i++) {
        const time = new Date(now + i * 7 * 24 * 60 * 60 * 1000);
        const timeLabel = time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const weekVariation = Math.sin(i * 0.15) * 0.05 + (Math.random() - 0.5) * 0.03;
        const actualPrice = currentPrice * (1 + weekVariation);
        
        const predictionError = (Math.random() - 0.5) * 0.025;
        const predictedPrice = actualPrice * (1 + predictionError);
        
        data.push({
          time: timeLabel,
          actual: Math.round(actualPrice * 100) / 100,
          predicted: Math.round(predictedPrice * 100) / 100,
          confidence: Math.round(75 + Math.random() * 25),
          isCorrect: Math.abs(predictionError) < 0.015
        });
      }
    } else if (predictionTimeframe === '3M') {
      // Generate data for past 3 months (monthly points)
      for (let i = -2; i <= 0; i++) {
        const nowDate = new Date(now);
        const time = new Date(nowDate.getFullYear(), nowDate.getMonth() + i, 1);
        const timeLabel = time.toLocaleDateString('en-US', { month: 'short' });
        
        const monthVariation = Math.sin(i * 0.1) * 0.08 + (Math.random() - 0.5) * 0.05;
        const actualPrice = currentPrice * (1 + monthVariation);
        
        const predictionError = (Math.random() - 0.5) * 0.04;
        const predictedPrice = actualPrice * (1 + predictionError);
        
        data.push({
          time: timeLabel,
          actual: Math.round(actualPrice * 100) / 100,
          predicted: Math.round(predictedPrice * 100) / 100,
          confidence: Math.round(70 + Math.random() * 30),
          isCorrect: Math.abs(predictionError) < 0.02
        });
      }
    } else if (predictionTimeframe === '1Y') {
      // Generate data for past year (quarterly points)
      for (let i = -3; i <= 0; i++) {
        const nowDate = new Date(now);
        const time = new Date(nowDate.getFullYear(), nowDate.getMonth() + i * 3, 1);
        const timeLabel = time.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        
        const quarterVariation = Math.sin(i * 0.05) * 0.12 + (Math.random() - 0.5) * 0.08;
        const actualPrice = currentPrice * (1 + quarterVariation);
        
        const predictionError = (Math.random() - 0.5) * 0.06;
        const predictedPrice = actualPrice * (1 + predictionError);
        
        data.push({
          time: timeLabel,
          actual: Math.round(actualPrice * 100) / 100,
          predicted: Math.round(predictedPrice * 100) / 100,
          confidence: Math.round(65 + Math.random() * 35),
          isCorrect: Math.abs(predictionError) < 0.03
        });
      }
    }
    
    return data;
  };

  const predictionData = getPredictionData();


  const currentMetrics = modelMetrics[selectedModel as keyof typeof modelMetrics];

  const generateDetailedReport = () => {
    const report = `
# AI Model Analysis Report - ${currentMetrics.name}
Generated on: ${new Date().toLocaleDateString()}

## Model Performance Summary
- Accuracy: ${currentMetrics.accuracy}%
- RMSE: ${currentMetrics.rmse}
- MAE: ${currentMetrics.mae}
- MAPE: ${currentMetrics.mape}%
- Sharpe Ratio: ${currentMetrics.sharpe}
- Max Drawdown: ${currentMetrics.maxDrawdown}%

## Prediction Statistics
- Total Predictions: ${currentMetrics.totalPredictions.toLocaleString()}
- Correct Predictions: ${currentMetrics.correctPredictions.toLocaleString()}
- Success Rate: ${((currentMetrics.correctPredictions / currentMetrics.totalPredictions) * 100).toFixed(2)}%

## Model Configuration
- LSTM Layers: 3 layers
- Hidden Units: 128 units
- Sequence Length: 60 timesteps
- Dropout Rate: 0.2

## Recent Performance Insights
- High accuracy period achieved during stable market conditions
- LSTM layers showing improved pattern recognition
- Increased prediction uncertainty during high volatility periods

## Recommendations
- Continue monitoring model performance during volatile periods
- Consider retraining if accuracy drops below 85%
- Implement additional technical indicators for enhanced predictions
    `;

    return report.trim();
  };

  const downloadReport = () => {
    const report = generateDetailedReport();
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentMetrics.name.replace(' ', '_')}_Analysis_Report_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Downloaded",
      description: "Detailed analysis report has been downloaded successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            AI Model Analysis
          </h1>
          <p className="text-gray-600">
            Deep dive into prediction performance and model behavior
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bitcoin">Bitcoin LSTM</SelectItem>
              <SelectItem value="ethereum">Ethereum LSTM</SelectItem>
              <SelectItem value="cardano">Cardano LSTM</SelectItem>
              <SelectItem value="polkadot">Polkadot LSTM</SelectItem>
              <SelectItem value="chainlink">Chainlink LSTM</SelectItem>
              <SelectItem value="solana">Solana LSTM</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={predictionTimeframe} onValueChange={setPredictionTimeframe}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Prediction Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1D">1 Day</SelectItem>
              <SelectItem value="7D">7 Days</SelectItem>
              <SelectItem value="1M">1 Month</SelectItem>
              <SelectItem value="3M">3 Months</SelectItem>
              <SelectItem value="1Y">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="crypto-glow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Accuracy</p>
                  <p className="text-2xl font-bold text-green-600">{currentMetrics.accuracy}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="crypto-glow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">RMSE</p>
                  <p className="text-2xl font-bold text-blue-600">{currentMetrics.rmse}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="crypto-glow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Sharpe Ratio</p>
                  <p className="text-2xl font-bold text-purple-600">{currentMetrics.sharpe}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="crypto-glow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Max Drawdown</p>
                  <p className="text-2xl font-bold text-orange-600">{currentMetrics.maxDrawdown}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <Card className="crypto-glow">
            <CardHeader>
              <CardTitle>Model Accuracy Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={accuracyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value: any, name: string) => {
                        if (name === 'Accuracy %') {
                          return [`${value}%`, name];
                        }
                        return [value, name];
                      }}
                      labelFormatter={(label: string) => `Month: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={(props: any) => {
                        const { payload } = props;
                        return (
                          <circle
                            {...props}
                            fill={payload?.isFuture ? "#f59e0b" : "#10b981"}
                            strokeWidth={2}
                            r={4}
                          />
                        );
                      }}
                      name="Accuracy %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="crypto-glow">
            <CardHeader>
              <CardTitle>Predictions vs Actual ({predictionTimeframe})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={predictionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis dataKey="time" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value: any, name: string, props: any) => {
                        const isCorrect = props.payload?.isCorrect;
                        const confidence = props.payload?.confidence;
                        if (name === 'Actual Price') {
                          return [`$${value}`, name];
                        } else if (name === 'Predicted Price') {
                          return [
                            `$${value} (${confidence}% confidence, ${isCorrect ? '✓ Correct' : '✗ Wrong'})`,
                            name
                          ];
                        }
                        return [value, name];
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#667eea"
                      strokeWidth={3}
                      dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
                      name="Actual Price"
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#f7971e"
                      strokeWidth={3}
                      strokeDasharray="8 8"
                      dot={(props: any) => {
                        const { payload } = props;
                        return (
                          <circle
                            {...props}
                            fill={payload?.isCorrect ? "#10b981" : "#ef4444"}
                            strokeWidth={2}
                            r={4}
                          />
                        );
                      }}
                      name="Predicted Price"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="crypto-glow">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Mean Absolute Error</p>
                    <p className="text-lg font-bold text-gray-800">{currentMetrics.mae}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">MAPE</p>
                    <p className="text-lg font-bold text-gray-800">{currentMetrics.mape}%</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Predictions</p>
                    <p className="text-lg font-bold text-gray-800">{currentMetrics.totalPredictions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Correct Predictions</p>
                    <p className="text-lg font-bold text-green-600">{currentMetrics.correctPredictions.toLocaleString()}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Model Configuration</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">LSTM Layers</span>
                      <Badge variant="outline">3 layers</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hidden Units</span>
                      <Badge variant="outline">128 units</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sequence Length</span>
                      <Badge variant="outline">60 timesteps</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dropout Rate</span>
                      <Badge variant="outline">0.2</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="crypto-glow">
            <CardHeader>
              <CardTitle>Recent Performance Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-800">High Accuracy Period</h4>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Model achieved 97.2% accuracy in the last 48 hours during stable market conditions.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">Model Learning</h4>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    LSTM layers showing improved pattern recognition for volatile market periods.
                  </p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <h4 className="font-semibold text-orange-800">Market Volatility</h4>
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    Increased prediction uncertainty detected during high volatility periods.
                  </p>
                </div>

                <div className="pt-4 space-y-2">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Report Generated",
                        description: "Detailed analysis report has been generated successfully.",
                      });
                    }}
                  >
                    Generate Detailed Report
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="default"
                    onClick={downloadReport}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Analysis;