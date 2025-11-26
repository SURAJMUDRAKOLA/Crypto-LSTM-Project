import { useState, useEffect } from 'react';
import { SupabaseApiService, PredictionData } from '@/services/supabaseApi';
import type { Tables } from '@/integrations/supabase/types';

type Prediction = Tables<'predictions'>;
type Model = Tables<'models'>;

export const useSupabasePredictions = (selectedCoin: string) => {
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch recent predictions
  const fetchPredictions = async () => {
    try {
      const data = await SupabaseApiService.getPredictions(selectedCoin, 10);
      setPredictions(data);
    } catch (err) {
      console.error('Error fetching predictions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch predictions');
    }
  };

  // Fetch models
  const fetchModels = async () => {
    try {
      const data = await SupabaseApiService.getModels(selectedCoin);
      setModels(data);
    } catch (err) {
      console.error('Error fetching models:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch models');
    }
  };

  // Generate new prediction using the enhanced LSTM service
  const generatePrediction = async (horizon: string = '1H') => {
    try {
      setLoading(true);
      
      const prediction = await SupabaseApiService.generatePrediction(selectedCoin, horizon);
      
      // Refresh predictions after generating new one
      await fetchPredictions();
      
      return prediction;
    } catch (err) {
      console.error('Error generating prediction:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate prediction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        fetchPredictions(),
        fetchModels()
      ]);
      
      setLoading(false);
    };

    if (selectedCoin) {
      loadData();
    }
  }, [selectedCoin]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!selectedCoin) return;

    const unsubscribe = SupabaseApiService.subscribeToPredictions(selectedCoin, (prediction) => {
      setPredictions(prev => [prediction, ...prev.slice(0, 9)]);
    });

    return unsubscribe;
  }, [selectedCoin]);

  return {
    predictions,
    models,
    loading,
    error,
    generatePrediction,
    refetch: () => {
      fetchPredictions();
      fetchModels();
    }
  };
};