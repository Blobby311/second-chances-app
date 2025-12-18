import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Send, Bot } from 'lucide-react-native';
import '../../global.css';
import { API_URL } from '../../config/api';
import { getAuthToken } from '../../config/auth';

export default function AIChatbotScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Array<{ id: string; sender: 'user' | 'bot'; content: string; timestamp: string }>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  // Load chat history on mount
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          // If not authenticated, show welcome message
          setMessages([{
            id: '1',
            sender: 'bot',
            content: 'Hello! I\'m your AI Plant Assistant powered by GPT OSS 120B. Ask me anything about growing plants, sustainable food practices, tips, and tricks!',
            timestamp: 'Now',
          }]);
          setLoadingHistory(false);
          return;
        }

        const response = await fetch(`${API_URL}/api/ai/chat/history`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && Array.isArray(data) && data.length > 0) {
          // Load existing messages
          const formattedMessages = data.map((msg: any) => ({
            id: msg.id,
            sender: msg.sender,
            content: msg.content,
            timestamp: formatTimestamp(msg.timestamp),
          }));
          setMessages(formattedMessages);
        } else {
          // No history, show welcome message
          setMessages([{
            id: '1',
            sender: 'bot',
            content: 'Hello! I\'m your AI Plant Assistant powered by GPT OSS 120B. Ask me anything about growing plants, sustainable food practices, tips, and tricks!',
            timestamp: 'Now',
          }]);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        // Show welcome message on error
        setMessages([{
          id: '1',
          sender: 'bot',
          content: 'Hello! I\'m your AI Plant Assistant powered by GPT OSS 120B. Ask me anything about growing plants, sustainable food practices, tips, and tricks!',
          timestamp: 'Now',
        }]);
      } finally {
        setLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, []);

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
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to get AI response');
      }

      // The backend now saves messages, so we reload from server to get real IDs
      // But for immediate UI update, we'll add the bot message optimistically
      const botMessage = {
        id: `temp-bot-${Date.now()}`,
        sender: 'bot' as const,
        content: data.response || 'I apologize, but I could not generate a response. Please try again.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, botMessage]);

      // Reload history to get real IDs and ensure consistency
      // But do it in background to not block UI
      setTimeout(async () => {
        try {
          const historyResponse = await fetch(`${API_URL}/api/ai/chat/history`, {
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
          // Silent fail - we already have the messages displayed
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
    // Scroll to bottom when new messages are added
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const renderMessage = ({ item }: { item: typeof messages[0] }) => {
    const isBot = item.sender === 'bot';
    return (
      <View
        className="flex-row mb-4"
        style={{
          alignSelf: isBot ? 'flex-start' : 'flex-end',
          maxWidth: '80%',
        }}
      >
        {isBot && (
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#2C4A34',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 8,
            }}
          >
            <Bot size={18} stroke="#E8F3E0" />
          </View>
        )}
        <View
          className="px-4 py-3 rounded-3xl"
          style={{
            backgroundColor: isBot ? '#2C4A34' : '#C85E51',
          }}
        >
          <Text className="text-base" style={{ color: '#ffffff', fontFamily: 'System' }}>
            {item.content}
          </Text>
        </View>
        {!isBot && (
          <View style={{ width: 32 }} />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#365441' }} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View
        className="flex-row items-center px-4"
        style={{ backgroundColor: '#2C4A34', paddingTop: 12, paddingBottom: 12 }}
      >
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} stroke="#ffffff" />
        </TouchableOpacity>
        <View className="flex-row items-center flex-1">
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#E8F3E0',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Bot size={18} stroke="#2C4A34" />
          </View>
          <View>
            <Text className="text-lg font-bold" style={{ color: '#ffffff', fontFamily: 'System' }}>
              AI Plant Assistant
            </Text>
            <Text className="text-xs" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
              Online
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Messages List */}
        {loadingHistory ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#E8F3E0" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={{ padding: 16, paddingBottom: 12 }}
            keyboardShouldPersistTaps="handled"
          />
        )}

        {/* Input - Fixed at bottom */}
        <View
          className="flex-row items-end px-4"
          style={{
            paddingTop: 8,
            paddingBottom: Platform.OS === 'ios' ? 8 : 8,
            backgroundColor: '#365441',
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: '#E8F3E0',
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginRight: 12,
              maxHeight: 100,
              borderWidth: 1,
              borderColor: '#2C4A34',
            }}
          >
            <TextInput
              placeholder="Ask about plant tips and tricks..."
              placeholderTextColor="#6b7280"
              value={input}
              onChangeText={setInput}
              style={{ color: '#2C4A34', fontFamily: 'System', fontSize: 15 }}
              multiline
            />
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: '#C85E51',
              borderRadius: 24,
              paddingHorizontal: 20,
              paddingVertical: 12,
              minWidth: 70,
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

