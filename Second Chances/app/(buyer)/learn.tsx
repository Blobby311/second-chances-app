import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Send, Bot, Sparkles, BookOpen, ChefHat, Leaf, Calendar } from 'lucide-react-native';
import '../../global.css';

// TODO: Replace with API call to get user's recent purchases
const RECENT_PURCHASES = [
  { id: '1', name: 'Rescued Veggie Box', items: ['Carrots', 'Tomatoes', 'Leafy Greens'] },
  { id: '2', name: 'Sunrise Fruit Crate', items: ['Apples', 'Oranges', 'Bananas'] },
];

// TODO: Replace with actual AI API call
const SAMPLE_RESPONSES = [
  "Great question! To store leafy greens from your Rescued Veggie Box, wrap them in a damp paper towel and place in a plastic bag in the crisper drawer. They'll stay fresh for 5-7 days!",
  "Your carrots will last longer if you remove the green tops and store them in a sealed container with water in the fridge. Change the water every few days.",
  "Based on your recent Sunrise Fruit Crate, those apples are best stored in the crisper drawer. Keep them away from bananas as they'll ripen faster!",
  "For the tomatoes from your veggie box, store them at room temperature until ripe, then move to the fridge. Never store unripe tomatoes in the fridge!",
  "Here's a quick recipe using your recent purchase: Stir-fry your leafy greens with garlic and a splash of soy sauce for 3-4 minutes. Simple and delicious!",
  "Your oranges and apples make a great combo for a fresh juice! Add a bit of ginger for extra zing.",
  "Carrots can be roasted at 200°C for 25-30 minutes with a drizzle of olive oil and honey. Perfect side dish!",
  "Fun fact: Leafy greens are in season during cooler months (November to February in Malaysia), making them more affordable and fresh!",
];

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

export default function LearnScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Array<{ id: string; sender: string; content: string; timestamp: string }>>([]);
  const [input, setInput] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  // Generate context from recent purchases
  const purchaseContext = RECENT_PURCHASES.map(p => p.name).join(', ');

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    setShowWelcome(false);

    // Add user message
    const userMessage = {
      id: `${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: 'Now',
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate AI response after a short delay
    setTimeout(() => {
      const randomResponse = SAMPLE_RESPONSES[Math.floor(Math.random() * SAMPLE_RESPONSES.length)];
      const botMessage = {
        id: `${Date.now() + 1}`,
        sender: 'bot',
        content: randomResponse,
        timestamp: 'Now',
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

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
                backgroundColor: '#4ade80',
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#365441' }} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4"
        style={{ backgroundColor: '#2C4A34', paddingTop: 12, paddingBottom: 12 }}
      >
        <View style={{ width: 24 }} />
        <View className="flex-1 items-center">
          <Text className="text-xl font-bold" style={{ color: '#ffffff', fontFamily: 'System' }}>
            AI Food Assistant
          </Text>
          <Text className="text-xs" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            Your personal produce guide
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {showWelcome ? (
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
                  borderColor: '#4ade80',
                }}
              >
                <Bot size={40} stroke="#4ade80" strokeWidth={2} />
              </View>
              <Text className="text-2xl font-bold mb-2 text-center" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                Welcome to AI Assistant
              </Text>
              <Text className="text-base text-center mb-4" style={{ color: '#E8F3E0', fontFamily: 'System', opacity: 0.9 }}>
                Get personalized tips based on your rescued boxes
              </Text>
            </View>

            {/* Recent Purchases Context */}
            {RECENT_PURCHASES.length > 0 && (
              <View 
                className="p-4 rounded-3xl mb-6"
                style={{ backgroundColor: '#2C4A34', borderWidth: 2, borderColor: '#4ade80' }}
              >
                <View className="flex-row items-center mb-3">
                  <Sparkles size={20} stroke="#4ade80" fill="#4ade80" />
                  <Text className="text-base font-bold ml-2" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                    Your Recent Rescues
                  </Text>
                </View>
                {RECENT_PURCHASES.map((purchase) => (
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
        ) : (
          <>
            {/* Recent Purchases Mini Banner */}
            {RECENT_PURCHASES.length > 0 && (
              <View 
                className="mx-4 mt-3 px-3 py-2 rounded-2xl"
                style={{ backgroundColor: '#2C4A34', borderWidth: 1, borderColor: '#4ade80' }}
              >
                <View className="flex-row items-center">
                  <Sparkles size={12} stroke="#4ade80" fill="#4ade80" />
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
          </>
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
              }}
              onPress={() => sendMessage(input)}
            >
              <Send size={20} stroke="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
