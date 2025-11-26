
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Bot, User, X, Minimize2, Maximize2 } from "lucide-react";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIChatWidgetProps {
  selectedCoin?: string;
  currentPrediction?: {
    price: number;
    confidence: number;
    trend: 'bullish' | 'bearish';
  };
}

const AIChatWidget = ({ selectedCoin = 'BTC', currentPrediction }: AIChatWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: `Hello! I'm your AI trading assistant. I can explain predictions, analyze market trends, and answer questions about ${selectedCoin}. What would you like to know?`,
      timestamp: new Date(),
      suggestions: [
        "Why is BTC expected to rise?",
        "Explain the prediction confidence",
        "What factors affect price?",
        "Risk assessment"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('why') && message.includes('rise')) {
      return `Based on our LSTM model analysis, ${selectedCoin} is expected to rise due to several key factors:

• **Technical Patterns**: The model detected bullish momentum in recent price movements
• **Volume Analysis**: Increasing trading volume suggests growing investor interest  
• **Market Sentiment**: Social sentiment indicators show positive community engagement
• **Historical Correlation**: Similar patterns in the past led to upward price movements

**Confidence Level**: ${currentPrediction?.confidence || 85}% - This indicates strong model certainty based on historical accuracy.`;
    }
    
    if (message.includes('confidence') || message.includes('accurate')) {
      return `Our AI model's confidence of ${currentPrediction?.confidence || 85}% is calculated based on:

• **Historical Accuracy**: The model has been correct in ${currentPrediction?.confidence || 85}% of similar predictions
• **Data Quality**: Using high-frequency market data with minimal noise
• **Pattern Recognition**: Strong correlation found with historical price patterns
• **Market Stability**: Current market conditions are within the model's training parameters

**Risk Assessment**: ${currentPrediction?.confidence && currentPrediction.confidence > 80 ? 'Low to Medium' : 'Medium to High'} risk based on volatility indicators.`;
    }
    
    if (message.includes('factor') || message.includes('affect')) {
      return `Several key factors influence ${selectedCoin} price predictions:

**Technical Factors**:
• Moving averages and momentum indicators
• Support and resistance levels  
• Trading volume patterns

**Market Factors**:
• Overall cryptocurrency market sentiment
• Bitcoin dominance (for altcoins)
• Regulatory news and adoption

**External Factors**:
• Macroeconomic indicators
• Institutional investment flows
• Social media sentiment

Our LSTM model weighs these factors based on their historical impact on price movements.`;
    }
    
    if (message.includes('risk')) {
      return `**Risk Assessment for ${selectedCoin}**:

**Current Risk Level**: ${currentPrediction?.confidence && currentPrediction.confidence > 80 ? 'Medium' : 'High'}

**Key Risks**:
• Market volatility can cause rapid price changes
• Regulatory developments may impact prices
• Technical analysis has inherent limitations

**Risk Mitigation**:
• Never invest more than you can afford to lose
• Use stop-loss orders to limit downside
• Diversify your cryptocurrency portfolio
• Stay informed about market developments

Remember: All predictions are for educational purposes only and should not be considered financial advice.`;
    }
    
    return `I understand you're asking about "${userMessage}". Based on current market analysis for ${selectedCoin}:

Our AI model is currently showing a ${currentPrediction?.trend || 'bullish'} outlook with ${currentPrediction?.confidence || 85}% confidence. This is based on advanced LSTM neural network analysis of historical price patterns, volume data, and market sentiment.

Key insights:
• Price target: $${currentPrediction?.price?.toLocaleString() || '45,000'}
• Trend: ${currentPrediction?.trend || 'Bullish'}
• Time horizon: Next 24-48 hours

Would you like me to explain any specific aspect in more detail?`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputValue),
        timestamp: new Date(),
        suggestions: [
          "Tell me more about this",
          "What are the risks?",
          "Show me the data",
          "Compare with other coins"
        ]
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  if (!isOpen) {
    return (
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 gradient-button shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        <div className="absolute -top-12 right-0 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm whitespace-nowrap">
          Ask AI about predictions
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`glass-card shadow-2xl ${isMinimized ? 'w-80 h-16' : 'w-80 md:w-96 h-96'} transition-all duration-300`}>
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Bot className="w-4 h-4 text-primary" />
            AI Trading Assistant
            <Badge variant="secondary" className="text-xs">Online</Badge>
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 h-6 w-6"
            >
              {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="p-1 h-6 w-6"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CardContent className="p-0 flex flex-col h-80">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <div className="flex items-start gap-2">
                          {message.type === 'ai' && <Bot className="w-4 h-4 mt-0.5 text-primary" />}
                          {message.type === 'user' && <User className="w-4 h-4 mt-0.5" />}
                          <div className="text-sm whitespace-pre-line">{message.content}</div>
                        </div>
                        
                        {message.suggestions && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-xs h-6 px-2"
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                        <Bot className="w-4 h-4 text-primary" />
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-border p-4">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask about predictions..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      size="sm"
                      className="gradient-button"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default AIChatWidget;
