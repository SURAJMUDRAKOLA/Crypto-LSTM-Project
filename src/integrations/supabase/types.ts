export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      market_data: {
        Row: {
          ath: number | null
          ath_date: string | null
          atl: number | null
          atl_date: string | null
          circulating_supply: number | null
          created_at: string
          current_price: number
          high_24h: number | null
          id: string
          image_url: string | null
          last_updated: string
          low_24h: number | null
          market_cap: number | null
          max_supply: number | null
          name: string
          price_change_24h: number | null
          price_change_percentage_24h: number | null
          symbol: string
          total_volume: number | null
        }
        Insert: {
          ath?: number | null
          ath_date?: string | null
          atl?: number | null
          atl_date?: string | null
          circulating_supply?: number | null
          created_at?: string
          current_price: number
          high_24h?: number | null
          id?: string
          image_url?: string | null
          last_updated?: string
          low_24h?: number | null
          market_cap?: number | null
          max_supply?: number | null
          name: string
          price_change_24h?: number | null
          price_change_percentage_24h?: number | null
          symbol: string
          total_volume?: number | null
        }
        Update: {
          ath?: number | null
          ath_date?: string | null
          atl?: number | null
          atl_date?: string | null
          circulating_supply?: number | null
          created_at?: string
          current_price?: number
          high_24h?: number | null
          id?: string
          image_url?: string | null
          last_updated?: string
          low_24h?: number | null
          market_cap?: number | null
          max_supply?: number | null
          name?: string
          price_change_24h?: number | null
          price_change_percentage_24h?: number | null
          symbol?: string
          total_volume?: number | null
        }
        Relationships: []
      }
      models: {
        Row: {
          accuracy: number | null
          created_at: string
          feature_importance: Json | null
          hyperparameters: Json | null
          id: string
          is_active: boolean
          last_trained_at: string | null
          mae: number | null
          mape: number | null
          model_type: string
          name: string
          symbol: string
          training_config: Json | null
          training_data_points: number | null
          updated_at: string
          validation_metrics: Json | null
          version: string
        }
        Insert: {
          accuracy?: number | null
          created_at?: string
          feature_importance?: Json | null
          hyperparameters?: Json | null
          id?: string
          is_active?: boolean
          last_trained_at?: string | null
          mae?: number | null
          mape?: number | null
          model_type?: string
          name: string
          symbol: string
          training_config?: Json | null
          training_data_points?: number | null
          updated_at?: string
          validation_metrics?: Json | null
          version?: string
        }
        Update: {
          accuracy?: number | null
          created_at?: string
          feature_importance?: Json | null
          hyperparameters?: Json | null
          id?: string
          is_active?: boolean
          last_trained_at?: string | null
          mae?: number | null
          mape?: number | null
          model_type?: string
          name?: string
          symbol?: string
          training_config?: Json | null
          training_data_points?: number | null
          updated_at?: string
          validation_metrics?: Json | null
          version?: string
        }
        Relationships: []
      }
      ohlcv_data: {
        Row: {
          close_price: number
          created_at: string
          high_price: number
          id: string
          low_price: number
          market_cap: number | null
          open_price: number
          symbol: string
          timeframe: string
          timestamp: string
          volume: number
        }
        Insert: {
          close_price: number
          created_at?: string
          high_price: number
          id?: string
          low_price: number
          market_cap?: number | null
          open_price: number
          symbol: string
          timeframe?: string
          timestamp: string
          volume: number
        }
        Update: {
          close_price?: number
          created_at?: string
          high_price?: number
          id?: string
          low_price?: number
          market_cap?: number | null
          open_price?: number
          symbol?: string
          timeframe?: string
          timestamp?: string
          volume?: number
        }
        Relationships: []
      }
      predictions: {
        Row: {
          actual_price: number | null
          confidence_level: number
          created_at: string
          current_price: number
          error_calculated: boolean | null
          features: Json | null
          id: string
          is_evaluated: boolean
          mae: number | null
          mape: number | null
          model_id: string
          predicted_for: string
          predicted_price: number
          prediction_horizon: string
          rmse: number | null
          symbol: string
        }
        Insert: {
          actual_price?: number | null
          confidence_level: number
          created_at?: string
          current_price: number
          error_calculated?: boolean | null
          features?: Json | null
          id?: string
          is_evaluated?: boolean
          mae?: number | null
          mape?: number | null
          model_id: string
          predicted_for: string
          predicted_price: number
          prediction_horizon: string
          rmse?: number | null
          symbol: string
        }
        Update: {
          actual_price?: number | null
          confidence_level?: number
          created_at?: string
          current_price?: number
          error_calculated?: boolean | null
          features?: Json | null
          id?: string
          is_evaluated?: boolean
          mae?: number | null
          mape?: number | null
          model_id?: string
          predicted_for?: string
          predicted_price?: number
          prediction_horizon?: string
          rmse?: number | null
          symbol?: string
        }
        Relationships: [
          {
            foreignKeyName: "predictions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
        ]
      }
      technical_indicators: {
        Row: {
          atr: number | null
          bb_bandwidth: number | null
          bb_lower: number | null
          bb_middle: number | null
          bb_upper: number | null
          created_at: string
          ema_10: number | null
          ema_20: number | null
          ema_50: number | null
          id: string
          macd: number | null
          macd_histogram: number | null
          macd_signal: number | null
          rsi_14: number | null
          sma_10: number | null
          sma_20: number | null
          sma_200: number | null
          sma_50: number | null
          stoch_d: number | null
          stoch_k: number | null
          symbol: string
          timeframe: string
          timestamp: string
          williams_r: number | null
        }
        Insert: {
          atr?: number | null
          bb_bandwidth?: number | null
          bb_lower?: number | null
          bb_middle?: number | null
          bb_upper?: number | null
          created_at?: string
          ema_10?: number | null
          ema_20?: number | null
          ema_50?: number | null
          id?: string
          macd?: number | null
          macd_histogram?: number | null
          macd_signal?: number | null
          rsi_14?: number | null
          sma_10?: number | null
          sma_20?: number | null
          sma_200?: number | null
          sma_50?: number | null
          stoch_d?: number | null
          stoch_k?: number | null
          symbol: string
          timeframe?: string
          timestamp: string
          williams_r?: number | null
        }
        Update: {
          atr?: number | null
          bb_bandwidth?: number | null
          bb_lower?: number | null
          bb_middle?: number | null
          bb_upper?: number | null
          created_at?: string
          ema_10?: number | null
          ema_20?: number | null
          ema_50?: number | null
          id?: string
          macd?: number | null
          macd_histogram?: number | null
          macd_signal?: number | null
          rsi_14?: number | null
          sma_10?: number | null
          sma_20?: number | null
          sma_200?: number | null
          sma_50?: number | null
          stoch_d?: number | null
          stoch_k?: number | null
          symbol?: string
          timeframe?: string
          timestamp?: string
          williams_r?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
