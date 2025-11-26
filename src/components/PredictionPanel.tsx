import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Zap, Target } from "lucide-react";
import { useSupabasePredictions } from "@/hooks/useSupabasePredictions";
import { useCryptoData } from "@/hooks/useCryptoData";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface PredictionPanelProps {
  selectedCoin: string;
}

const PredictionPanel = ({ selectedCoin }: PredictionPanelProps) => {
  const { predictions, models, loading, error, generatePrediction } = useSupabasePredictions(selectedCoin);
  const { cryptoData } = useCryptoData(selectedCoin, '1D');
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const currentCrypto = cryptoData.find(crypto => crypto.symbol === selectedCoin);
  const currentPrice = currentCrypto?.price || 0;
  const activeModel = models[0]; // Get the most recent model

  const handleGeneratePrediction = async (horizon: string) => {
    setGenerating(true);
    try {
      await generatePrediction(horizon);
      
      toast({
        title: "Real LSTM Prediction Generated",
        description: `New ${horizon} prediction from trained deep learning model created successfully`,
      });
    } catch (err) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate LSTM prediction. Please ensure the Python backend is running.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const formatTimeframe = (horizon: string) => {
    switch (horizon) {
      case '1H': return '1 Hour';
      case '24H': return '24 Hours';
      case '7D': return '7 Days';
      default: return horizon;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Real LSTM Predictions */}
      <Card className="crypto-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Real LSTM Deep Learning Predictions
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Powered by TensorFlow/Keras neural networks trained on real historical data
          </p>
          <div className="flex gap-2">
            {['1H', '24H', '7D'].map((horizon) => (
              <Button
                key={horizon}
                variant="outline"
                size="sm"
                onClick={() => handleGeneratePrediction(horizon)}
                disabled={generating || loading}
                className="flex items-center gap-1"
              >
                <Zap className="h-3 w-3" />
                {formatTimeframe(horizon)}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && <div className="text-center text-muted-foreground">Loading LSTM predictions...</div>}
          {error && (
            <div className="text-center text-red-500 p-4 border rounded-lg bg-red-50">
              <p className="font-medium">Error: {error}</p>
              <p className="text-sm mt-2">Make sure the Python LSTM backend is running and properly configured.</p>
            </div>
          )}
          
          {predictions.length === 0 && !loading && (
            <div className="text-center text-muted-foreground py-4">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="font-medium">No Real LSTM Predictions Yet</p>
              <p className="text-sm">Generate your first deep learning prediction above</p>
              <p className="text-xs mt-2 opacity-75">Each prediction uses a trained neural network model</p>
            </div>
          )}

          {predictions.slice(0, 5).map((pred) => {
            const change = ((pred.predicted_price - pred.current_price) / pred.current_price) * 100;
            const isPositive = change >= 0;
            
            return (
              <div key={pred.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors bg-gradient-to-r from-blue-50/30 to-purple-50/30">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">{formatTimeframe(pred.prediction_horizon)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(pred.created_at)}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    LSTM
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${pred.predicted_price.toLocaleString()}</div>
                  <div className="flex items-center gap-2">
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {isPositive ? '+' : ''}{change.toFixed(2)}%
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {(pred.confidence_level * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Real Model Performance */}
      {activeModel && (
        <Card className="crypto-glow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Real LSTM Model Performance
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Actual metrics from TensorFlow model training and validation
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Directional Accuracy</p>
                <p className="text-xl font-bold text-green-600">{((activeModel.accuracy || 0) * 100).toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Real backtesting</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">MAE (USD)</p>
                <p className="text-xl font-bold text-blue-600">${(activeModel.mae || 0).toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">Mean absolute error</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">MAPE</p>
                <p className="text-xl font-bold text-purple-600">{(activeModel.mape || 0).toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Mean absolute % error</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
              <p className="text-sm text-slate-700 text-center">
                <strong>Model:</strong> {activeModel.name} v{activeModel.version} | 
                <strong> Training Data:</strong> {(activeModel.training_data_points || 0).toLocaleString()} samples |
                <strong> Last Trained:</strong> {activeModel.last_trained_at ? new Date(activeModel.last_trained_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PredictionPanel;