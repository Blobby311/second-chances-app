import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, StatusBar, ScrollView, ActivityIndicator, Animated, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Send, Bot, Sparkles, ChefHat, Leaf, Calendar, BookOpen } from 'lucide-react-native';
import '../../global.css';
import { API_URL } from '../../config/api';
import { getAuthToken } from '../../config/auth';

const TOPIC_CARDS = [
  { 
    id: 'storage', 
    title: 'Storage Tips', 
    icon: Leaf,
    question: 'How should I store vegetables from my recent box?',
    color: '#2C4A34',
  },
  { 
    id: 'recipes', 
    title: 'Recipe Ideas', 
    icon: ChefHat,
    question: 'Give me recipe ideas for my recent purchases',
    color: '#C85E51',
  },
  { 
    id: 'seasonal', 
    title: 'Seasonal Guide', 
    icon: Calendar,
    question: 'What fruits and vegetables are in season now?',
    color: '#88B04B',
  },
  { 
    id: 'nutrition', 
    title: 'Nutrition Info', 
    icon: BookOpen,
    question: 'What are the nutritional benefits of my recent box?',
    color: '#E3A45D',
  },
];

interface RecentPurchase {
  id: string;
  name: string;
  items: string[];
}

export default function AIChatbotScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Array<{ id: string; sender: 'user' | 'bot'; content: string; timestamp: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [recentPurchases, setRecentPurchases] = useState<RecentPurchase[]>([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const welcomeOpacity = useRef(new Animated.Value(1)).current;
  const chatOpacity = useRef(new Animated.Value(0)).current;

  // Fetch recent purchases for context
  useEffect(() => {
    const fetchRecentPurchases = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        const response = await fetch(`${API_URL}/api/orders/buyer/orders?status=completed`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const orders = await response.json();
          // Get last 2 completed orders
          const recent = orders.slice(0, 2).map((order: any) => ({
            id: order._id || order.id,
            name: order.product?.name || 'Rescued Box',
            items: [order.product?.name || 'Fresh produce'], // Simplified for now
          }));
          setRecentPurchases(recent);
        }
      } catch (error) {
        console.error('Error fetching recent purchases:', error);
      }
    };

    fetchRecentPurchases();
  }, []);

  // Load chat history function
  const loadChatHistory = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setMessages([{
          id: '1',
          sender: 'bot',
          content: 'Hello! I\'m your AI Food Assistant. I can help you with cooking tips, food storage, recipes, meal planning, and reducing food waste!',
          timestamp: 'Now',
        }]);
        setLoadingHistory(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/ai/chat/history?role=buyer`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && Array.isArray(data) && data.length > 0) {
        const formattedMessages = data.map((msg: any) => ({
          id: msg.id,
          sender: msg.sender,
          content: msg.content,
          timestamp: formatTimestamp(msg.timestamp),
        }));
        setMessages(formattedMessages);
        // If there's chat history, smoothly transition to chat interface
        setShowWelcome(false);
        welcomeOpacity.setValue(0);
        chatOpacity.setValue(1);
      } else {
        setMessages([{
          id: '1',
          sender: 'bot',
          content: 'Hello! I\'m your AI Food Assistant. I can help you with cooking tips, food storage, recipes, meal planning, and reducing food waste!',
          timestamp: 'Now',
        }]);
        // No history, show welcome screen
        setShowWelcome(true);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      setMessages([{
        id: '1',
        sender: 'bot',
        content: 'Hello! I\'m your AI Food Assistant. I can help you with cooking tips, food storage, recipes, meal planning, and reducing food waste!',
        timestamp: 'Now',
      }]);
      setShowWelcome(true);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  // Reload chat history when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadChatHistory();
    }, [loadChatHistory])
  );

  const formatTimestamp = (timestamp: string | Date): string => {
    if (!timestamp) return 'Now';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    // Smooth transition: fade out welcome, fade in chat
    if (showWelcome) {
      Animated.parallel([
        Animated.timing(welcomeOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(chatOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowWelcome(false);
      });
    }

    // Add user message optimistically
    const userMessage = {
      id: `temp-${Date.now()}`,
      sender: 'user' as const,
      content: text,
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text, role: 'buyer' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to get AI response');
      }

      const botMessage = {
        id: `temp-bot-${Date.now()}`,
        sender: 'bot' as const,
        content: data.response || 'I apologize, but I could not generate a response. Please try again.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, botMessage]);

      // Reload history to get real IDs
      setTimeout(async () => {
        try {
          const historyResponse = await fetch(`${API_URL}/api/ai/chat/history?role=buyer`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          const historyData = await historyResponse.json();
          if (historyResponse.ok && Array.isArray(historyData)) {
            const formattedMessages = historyData.map((msg: any) => ({
              id: msg.id,
              sender: msg.sender,
              content: msg.content,
              timestamp: formatTimestamp(msg.timestamp),
            }));
            setMessages(formattedMessages);
          }
        } catch (e) {
          // Silent fail
        }
      }, 500);
    } catch (error: any) {
      const errorMessage = {
        id: `temp-error-${Date.now()}`,
        sender: 'bot' as const,
        content: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Handle keyboard show/hide to auto-scroll messages
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        // Scroll to end when keyboard appears so input is visible
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const renderMessage = ({ item }: { item: typeof messages[0] }) => {
    const isBot = item.sender === 'bot';
    return (
      <View
        className="mb-4"
        style={{
          alignSelf: isBot ? 'flex-start' : 'flex-end',
          maxWidth: '85%',
        }}
      >
        {isBot && (
          <View className="flex-row items-center mb-2">
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: '#8FC0A9',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
              }}
            >
              <Bot size={16} stroke="#2C4A34" strokeWidth={2.5} />
            </View>
            <Text className="text-xs font-semibold" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
              AI Assistant
            </Text>
          </View>
        )}
        <View
          className="px-4 py-3 rounded-3xl"
          style={{
            backgroundColor: isBot ? '#E8F3E0' : '#C85E51',
            borderWidth: isBot ? 1 : 0,
            borderColor: '#2C4A34',
          }}
        >
          <Text 
            className="text-base" 
            style={{ 
              color: isBot ? '#2C4A34' : '#ffffff', 
              fontFamily: 'System', 
              lineHeight: 22 
            }}
          >
            {item.content}
          </Text>
          <Text 
            className="text-xs mt-1" 
            style={{ 
              color: isBot ? '#6b7280' : '#ffffffcc', 
              fontFamily: 'System' 
            }}
          >
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  // Generate context from recent purchases
  const purchaseContext = recentPurchases.map(p => p.name).join(', ');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#365441' }} edges={['top']}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4"
        style={{ backgroundColor: '#2C4A34', paddingTop: 12, paddingBottom: 12 }}
      >
        <View style={{ width: 24 }} />
        <View className="flex-1 items-center">
          <Text className="text-xl font-bold" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            AI Food Assistant
          </Text>
          <Text className="text-xs" style={{ color: '#E8F3E0', fontFamily: 'System', opacity: 0.9 }}>
            Your personal produce guide
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
      >
        {loadingHistory ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#E8F3E0" />
          </View>
        ) : showWelcome ? (
          <Animated.View 
            style={{ 
              flex: 1,
              opacity: welcomeOpacity,
            }}
          >
            <ScrollView 
              className="flex-1"
              contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
            >
            {/* Welcome Section */}
            <View className="items-center mb-6 mt-4">
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: '#2C4A34',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  borderWidth: 3,
                  borderColor: '#8FC0A9',
                }}
              >
                <Bot size={40} stroke="#8FC0A9" strokeWidth={2} />
              </View>
              <Text className="text-2xl font-bold mb-2 text-center" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                Welcome to AI Assistant
              </Text>
              <Text className="text-base text-center mb-4" style={{ color: '#E8F3E0', fontFamily: 'System', opacity: 0.9 }}>
                Get personalized tips based on your rescued boxes
              </Text>
            </View>

            {/* Recent Purchases Context */}
            {recentPurchases.length > 0 && (
              <View 
                className="p-4 rounded-3xl mb-6"
                style={{ backgroundColor: '#2C4A34', borderWidth: 2, borderColor: '#8FC0A9' }}
              >
                <View className="flex-row items-center mb-3">
                  <Sparkles size={20} stroke="#8FC0A9" fill="#8FC0A9" />
                  <Text className="text-base font-bold ml-2" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                    Your Recent Rescues
                  </Text>
                </View>
                {recentPurchases.map((purchase) => (
                  <View key={purchase.id} className="mb-2">
                    <Text className="text-sm font-semibold mb-1" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                      • {purchase.name}
                    </Text>
                    <Text className="text-xs ml-3" style={{ color: '#E8F3E0', fontFamily: 'System', opacity: 0.8 }}>
                      Contains: {purchase.items.join(', ')}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Topic Suggestions */}
            <Text className="text-lg font-bold mb-3" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
              Suggestions
            </Text>
            <View style={{ gap: 8 }}>
              <View className="flex-row" style={{ gap: 8 }}>
                <TouchableOpacity
                  onPress={() => setInput(TOPIC_CARDS[0].question)}
                  className="flex-1 items-center px-4 py-2 rounded-full"
                  style={{ 
                    backgroundColor: '#E8F3E0',
                    opacity: 0.7,
                  }}
                  activeOpacity={0.5}
                >
                  <Text 
                    className="text-sm font-semibold" 
                    style={{ color: '#2C4A34', fontFamily: 'System' }}
                  >
                    {TOPIC_CARDS[0].title}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setInput(TOPIC_CARDS[1].question)}
                  className="flex-1 items-center px-4 py-2 rounded-full"
                  style={{ 
                    backgroundColor: '#E8F3E0',
                    opacity: 0.7,
                  }}
                  activeOpacity={0.5}
                >
                  <Text 
                    className="text-sm font-semibold" 
                    style={{ color: '#2C4A34', fontFamily: 'System' }}
                  >
                    {TOPIC_CARDS[1].title}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row" style={{ gap: 8 }}>
                <TouchableOpacity
                  onPress={() => setInput(TOPIC_CARDS[2].question)}
                  className="flex-1 items-center px-4 py-2 rounded-full"
                  style={{ 
                    backgroundColor: '#E8F3E0',
                    opacity: 0.7,
                  }}
                  activeOpacity={0.5}
                >
                  <Text 
                    className="text-sm font-semibold" 
                    style={{ color: '#2C4A34', fontFamily: 'System' }}
                  >
                    {TOPIC_CARDS[2].title}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setInput(TOPIC_CARDS[3].question)}
                  className="flex-1 items-center px-4 py-2 rounded-full"
                  style={{ 
                    backgroundColor: '#E8F3E0',
                    opacity: 0.7,
                  }}
                  activeOpacity={0.5}
                >
                  <Text 
                    className="text-sm font-semibold" 
                    style={{ color: '#2C4A34', fontFamily: 'System' }}
                  >
                    {TOPIC_CARDS[3].title}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          </Animated.View>
        ) : (
          <Animated.View
            style={{
              flex: 1,
              opacity: chatOpacity,
            }}
          >
            {/* Recent Purchases Mini Banner */}
            {recentPurchases.length > 0 && (
              <View 
                className="mx-4 mt-3 px-3 py-2 rounded-2xl"
                style={{ backgroundColor: '#2C4A34', borderWidth: 1, borderColor: '#8FC0A9' }}
              >
                <View className="flex-row items-center">
                  <Sparkles size={12} stroke="#8FC0A9" fill="#8FC0A9" />
                  <Text className="text-xs font-semibold ml-2 flex-1" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                    Based on: {purchaseContext}
                  </Text>
                </View>
              </View>
            )}

            {/* Messages List */}
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              contentContainerStyle={{ padding: 16, paddingBottom: 12 }}
              keyboardShouldPersistTaps="handled"
            />
          </Animated.View>
        )}

        {/* Input - Fixed at bottom */}
        <View
          className="px-4"
          style={{
            paddingTop: 12,
            paddingBottom: Platform.OS === 'ios' ? 8 : 12,
            backgroundColor: '#365441',
          }}
        >
          <View
            className="flex-row items-center rounded-3xl"
            style={{
              backgroundColor: '#E8F3E0',
              borderWidth: 2,
              borderColor: '#2C4A34',
              height: 56,
              paddingLeft: 16,
              paddingRight: 6,
            }}
          >
            <TextInput
              placeholder="Ask me anything about your produce..."
              placeholderTextColor="#6b7280"
              value={input}
              onChangeText={setInput}
              style={{ 
                flex: 1,
                color: '#2C4A34', 
                fontFamily: 'System', 
                fontSize: 15,
                paddingRight: 8,
              }}
              maxLength={200}
            />
            <TouchableOpacity
              style={{
                backgroundColor: '#C85E51',
                borderRadius: 20,
                width: 44,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: loading ? 0.7 : 1,
              }}
              onPress={() => sendMessage(input)}
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Send size={20} stroke="#ffffff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
