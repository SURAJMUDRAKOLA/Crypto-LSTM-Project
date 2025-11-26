import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, Zap, Activity, Target, Play, Pause, Settings } from "lucide-react";

const AIModels = () => {
  const [trainingProgress, setTrainingProgress] = useState(85);
  const [isTraining, setIsTraining] = useState(false);

  const modelData = {
    bitcoin: {
      name: "Bitcoin LSTM Model",
      accuracy: 94.2,
      lastTrained: "2024-08-01",
      dataPoints: "2+ years",
      status: "Active",
      predictions: 15420,
      rmse: 145.7,
      mae: 98.3,
      mape: 2.4
    },
    ethereum: {
      name: "Ethereum LSTM Model", 
      accuracy: 91.8,
      lastTrained: "2024-08-01",
      dataPoints: "2+ years", 
      status: "Active",
      predictions: 12350,
      rmse: 12.3,
      mae: 8.9,
      mape: 3.1
    },
    altcoins: {
      name: "Multi-Coin LSTM Model",
      accuracy: 88.5,
      lastTrained: "2024-07-30",
      dataPoints: "18 months",
      status: "Training",
      predictions: 8920,
      rmse: 0.89,
      mae: 0.67,
      mape: 4.2
    }
  };

  const handleStartTraining = () => {
    setIsTraining(true);
    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          setIsTraining(false);
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            AI Model Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor and manage your LSTM cryptocurrency prediction models
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="data">Data Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(modelData).map(([key, model]) => (
                <Card key={key} className="crypto-glow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Brain className="w-5 h-5 text-blue-600" />
                        <span>{model.name}</span>
                      </CardTitle>
                      <Badge variant={model.status === "Active" ? "default" : "secondary"}>
                        {model.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Accuracy</span>
                        <span className="font-bold text-green-600">{model.accuracy}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Predictions Made</span>
                        <span className="font-medium">{model.predictions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Training Data</span>
                        <span className="font-medium">{model.dataPoints}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Last Trained</span>
                        <span className="font-medium">{model.lastTrained}</span>
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure Model
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <Card className="crypto-glow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span>Model Training Center</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Training Progress</h3>
                      <p className="text-sm text-gray-600">
                        {isTraining ? "Currently training Bitcoin model..." : "Ready to start training"}
                      </p>
                    </div>
                    <Button 
                      onClick={handleStartTraining}
                      disabled={isTraining}
                      className={isTraining ? "bg-red-600 hover:bg-red-700" : ""}
                    >
                      {isTraining ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Stop Training
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Training
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{trainingProgress}%</span>
                    </div>
                    <Progress value={trainingProgress} className="w-full" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">156</p>
                      <p className="text-sm text-gray-600">Epochs Completed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">0.0023</p>
                      <p className="text-sm text-gray-600">Current Loss</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">94.2%</p>
                      <p className="text-sm text-gray-600">Validation Accuracy</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">2h 34m</p>
                      <p className="text-sm text-gray-600">Time Remaining</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="crypto-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    <span>Model Accuracy Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(modelData).map(([key, model]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{model.name}</span>
                          <span className="text-green-600 font-bold">{model.accuracy}%</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="text-center">
                            <p className="text-gray-600">RMSE</p>
                            <p className="font-medium">{model.rmse}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600">MAE</p>
                            <p className="font-medium">{model.mae}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600">MAPE</p>
                            <p className="font-medium">{model.mape}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="crypto-glow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-purple-500" />
                    <span>Prediction Statistics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">36,690</p>
                        <p className="text-sm text-gray-600">Total Predictions</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">91.7%</p>
                        <p className="text-sm text-gray-600">Average Accuracy</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">24/7</p>
                        <p className="text-sm text-gray-600">Real-time Analysis</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <p className="text-2xl font-bold text-orange-600">6</p>
                        <p className="text-sm text-gray-600">Cryptocurrencies</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card className="crypto-glow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span>Training Data Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Data Sources</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Historical Prices</span>
                        <Badge variant="outline">CoinGecko API</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Trading Volume</span>
                        <Badge variant="outline">Real-time</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Market Sentiment</span>
                        <Badge variant="outline">Social Media</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Technical Indicators</span>
                        <Badge variant="outline">Calculated</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Data Quality</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Completeness</span>
                          <span>99.8%</span>
                        </div>
                        <Progress value={99.8} className="mt-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Accuracy</span>
                          <span>98.5%</span>
                        </div>
                        <Progress value={98.5} className="mt-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Freshness</span>
                          <span>100%</span>
                        </div>
                        <Progress value={100} className="mt-1" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Dataset Stats</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Records</span>
                        <span className="font-medium">1.2M+</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time Range</span>
                        <span className="font-medium">2+ Years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Update Frequency</span>
                        <span className="font-medium">30 seconds</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Features</span>
                        <span className="font-medium">15+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AIModels;