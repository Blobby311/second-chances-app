import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Alert,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import '../../global.css';
import { API_URL } from '../../config/api';
import { getAuthToken } from '../../config/auth';

const BUYER_QUICK_REPLIES = ['Is 5 PM okay?', "I'm here", 'Thank you!'];
const SELLER_QUICK_REPLIES = ['Your order is ready!', 'When can you pick up?', 'Thank you for your order!'];

// Sample messages for testing/fallback
const SAMPLE_MESSAGES: Message[] = [
  {
    id: 'sample-msg-1',
    sender: 'seller',
    senderId: 'sample-seller',
    content: 'Hi! Your order is ready for pickup. When would you like to collect it?',
    timestamp: '2h ago',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'sample-msg-2',
    sender: 'buyer',
    senderId: 'sample-buyer',
    content: 'Is 5 PM okay?',
    timestamp: '1h ago',
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: 'sample-msg-3',
    sender: 'seller',
    senderId: 'sample-seller',
    content: 'Perfect! See you at 5 PM then!',
    timestamp: 'Just now',
    createdAt: new Date(),
  },
];

interface Message {
  id: string;
  sender: string;
  senderId: string;
  content: string;
  timestamp: string;
  createdAt: Date;
}

export default function ChatScreen() {
  const { id: chatId, orderId } = useLocalSearchParams<{ id: string; orderId?: string }>();
  const router = useRouter();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatPartner, setChatPartner] = useState<{ name: string; avatar: string; online: boolean } | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isSeller, setIsSeller] = useState<boolean>(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const currentUserRole = isSeller ? 'seller' : 'buyer';
  const chatPartnerRole = isSeller ? 'buyer' : 'seller';

  // Format timestamp
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

  // Load chat messages
  const loadMessages = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token || !chatId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      // Get current user info
      const userResponse = await fetch(`${API_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let userId = currentUserId;
      if (userResponse.ok) {
        const user = await userResponse.json();
        userId = user._id || user.id;
        setCurrentUserId(userId);
      }

      // Get chat messages first (this will also validate the chat exists and user has access)
      const response = await fetch(`${API_URL}/api/chat/${chatId}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle 404 - check if it's a sample chat, otherwise it's a real chat that needs to be created
      if (response.status === 404) {
        // Only show sample messages if it's actually a sample chat ID
        if (chatId.startsWith('sample-')) {
          console.log('Sample chat (404) - showing sample messages for testing');
          setMessages(SAMPLE_MESSAGES);
          setChatPartner({
            name: 'Uncle Roger',
            avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa3du6j726GP7-rDxHda8-FYopWptm3LsTWA&s',
            online: false,
          });
          setLoading(false);
          return;
        }
        // For real user IDs, the backend will create the chat automatically
        // Set empty messages - user can send first message
        console.log('New chat (404) - chat will be created when first message is sent');
        setMessages([]);
        // Try to get partner info from chat list or user profile
        // We'll try to get it when the chat is actually created
        // For now, set a generic partner
        setChatPartner({
          name: 'User',
          avatar: '',
          online: false,
        });
        setLoading(false);
        return;
      } else if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        const errorMessage = errorData?.error || errorData?.message || `Failed with status ${response.status}`;
        console.error('Error loading messages:', response.status, errorMessage);
        // For 403, user doesn't have access - show error
        if (response.status === 403) {
          Alert.alert('Access Denied', 'You do not have permission to view this chat.');
          router.back();
          return;
        }
        throw new Error(errorMessage);
      }

      // Get chat list to find this chat and determine partner (only if messages loaded successfully)
      let chatInfo = null;
      if (response.ok) {
        try {
          const chatListResponse = await fetch(`${API_URL}/api/chat?role=buyer`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (chatListResponse.ok) {
            const chats = await chatListResponse.json();
            chatInfo = chats.find((c: any) => (c._id || c.id) === chatId);
          }

          // If not found in buyer list, try seller list
          if (!chatInfo) {
            const sellerChatListResponse = await fetch(`${API_URL}/api/chat?role=seller`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            });
            if (sellerChatListResponse.ok) {
              const sellerChats = await sellerChatListResponse.json();
              chatInfo = sellerChats.find((c: any) => (c._id || c.id) === chatId);
            }
          }
        } catch (error) {
          console.warn('Could not fetch chat info for partner details:', error);
          // Continue anyway - we can still show messages without partner info
        }
      }

      const data = response.ok ? await response.json() : [];
      console.log('Messages loaded successfully:', Array.isArray(data) ? data.length : 0, 'messages');
      
      // Determine partner from chat info
      let userIsSeller = false;
      if (chatInfo) {
        // Determine if current user is buyer or seller
        const buyerId = chatInfo.buyer?._id || chatInfo.buyer;
        const sellerId = chatInfo.seller?._id || chatInfo.seller;
        const isCurrentUserBuyer = buyerId === userId;
        userIsSeller = !isCurrentUserBuyer;
        setIsSeller(userIsSeller);
        
        // Set chat partner
        if (isCurrentUserBuyer) {
          setChatPartner({
            name: chatInfo.seller?.name || 'Seller',
            avatar: chatInfo.seller?.avatar || '',
            online: false, // TODO: Implement online status
          });
        } else {
          setChatPartner({
            name: chatInfo.buyer?.name || 'Buyer',
            avatar: chatInfo.buyer?.avatar || '',
            online: false, // TODO: Implement online status
          });
        }
      }

      // Format messages
      // If we couldn't determine role from chatInfo, try to infer from messages
      // This is a fallback - we'll determine per message if needed
      if (!chatInfo && Array.isArray(data) && data.length > 0) {
        // Default to buyer role if we can't determine
        userIsSeller = false;
        setIsSeller(false);
      }
      
      const userRole = userIsSeller ? 'seller' : 'buyer';
      const partnerRole = userIsSeller ? 'buyer' : 'seller';
      const formattedMessages: Message[] = Array.isArray(data) ? data.map((msg: any) => {
        const msgSenderId = msg.sender?._id || msg.sender;
        const isCurrentUser = msgSenderId === userId;
        return {
          id: msg._id || msg.id,
          sender: isCurrentUser ? userRole : partnerRole,
          senderId: msgSenderId,
          content: msg.content,
          timestamp: formatTimestamp(msg.createdAt),
          createdAt: new Date(msg.createdAt),
        };
      }) : [];

      setMessages(formattedMessages);
    } catch (error: any) {
      console.error('Error loading messages:', error);
      console.error('Error details:', {
        message: error?.message,
        stack: error?.stack,
        chatId,
        apiUrl: API_URL,
      });
      
      // Check if it's a network error (backend not reachable)
      if (error?.message === 'Network request failed' || error?.message?.includes('Network')) {
        console.warn('Network error - backend may not be reachable. Check if backend is running at:', API_URL);
        // Still show sample messages for UI testing, but log the issue
        if (chatId.startsWith('sample-')) {
          setMessages(SAMPLE_MESSAGES);
          setChatPartner({
            name: 'Uncle Roger',
            avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa3du6j726GP7-rDxHda8-FYopWptm3LsTWA&s',
            online: false,
          });
        } else {
          // For real chats with network errors, show empty state with a message
          setMessages([]);
          setChatPartner({
            name: 'User',
            avatar: '',
            online: false,
          });
        }
      } else {
        // Other errors - show sample messages as fallback
        if (chatId.startsWith('sample-')) {
          setMessages(SAMPLE_MESSAGES);
          setChatPartner({
            name: 'Uncle Roger',
            avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa3du6j726GP7-rDxHda8-FYopWptm3LsTWA&s',
            online: false,
          });
        }
      }
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  // Load messages on mount and when screen is focused
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useFocusEffect(
    useCallback(() => {
      loadMessages();
    }, [loadMessages])
  );

  // Scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Handle keyboard show/hide
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        // Scroll to end when keyboard appears
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

  const sendMessage = async (text: string) => {
    if (!text.trim() || sending || !chatId) return;

    // Check if this is a sample/dummy chat
    if (chatId.startsWith('sample-')) {
      Alert.alert(
        'Demo Chat',
        'This is a sample chat for demonstration. To send real messages, please start a chat from a product or order.',
        [{ text: 'OK' }]
      );
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const tempMessage: Message = {
      id: tempId,
      sender: currentUserRole,
      senderId: currentUserId || '',
      content: text,
      timestamp: 'Just now',
      createdAt: new Date(),
    };

    // Optimistically add message
    setMessages((prev) => [...prev, tempMessage]);
    setInput('');
    setSending(true);

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_URL}/api/chat/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to send message' }));
        throw new Error(errorData?.error || 'Failed to send message');
      }

      // Reload messages to get the real message from server
      await loadMessages();
    } catch (error: any) {
      console.error('Error sending message:', error);
      // Remove temp message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      setInput(text); // Restore input
      Alert.alert('Error', error?.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleCompleteTransaction = () => {
    // TODO: Mark transaction as complete via API
    setIsComplete(true);
    // Navigate to rating screen
    const order = orderId || `order-${Date.now()}`;
    router.push({
      pathname: '/rating/[orderId]',
      params: { orderId: order, sellerId: chatId },
    });
  };

  const chatPartnerDetails = chatPartner || {
    name: 'User',
    avatar: '',
    online: false,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#365441' }} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
      >
        <View className="flex-1">
          {/* Header */}
          <View className="flex-row items-center px-4" style={{ paddingTop: 8, paddingBottom: 12, backgroundColor: '#2C4A34' }}>
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <ArrowLeft size={24} stroke="#E8F3E0" />
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-row items-center flex-1"
              onPress={() => {
                // Only navigate to seller profile if chatting with a seller
                if (!isSeller && chatId) {
                  router.push(`/seller-profile/${chatId}`);
                }
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  overflow: 'hidden',
                  marginRight: 12,
                  backgroundColor: '#E8F3E0',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {chatPartnerDetails.avatar ? (
                  <Image source={{ uri: chatPartnerDetails.avatar }} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <Text className="text-lg font-semibold" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                    {chatPartnerDetails.name[0]}
                  </Text>
                )}
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                  {chatPartnerDetails.name}
                </Text>
                <View className="flex-row items-center" style={{ marginTop: 2 }}>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: chatPartnerDetails.online ? '#4ade80' : '#9ca3af',
                      marginRight: 6,
                    }}
                  />
                <Text className="text-xs" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                    {chatPartnerDetails.online ? 'Online now' : 'Last active recently'}
                </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Messages List */}
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#E8F3E0" />
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ padding: 16, paddingBottom: 12 }}
              renderItem={({ item }) => {
                const isCurrentUser = item.sender === currentUserRole;
                return (
                <View
                  className="mb-3 px-4 py-3 rounded-3xl"
                  style={{
                      alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
                      backgroundColor: isCurrentUser ? '#C85E51' : '#2C4A34',
                    maxWidth: '80%',
                  }}
                >
                  <Text className="text-base" style={{ color: '#ffffff', fontFamily: 'System' }}>
                    {item.content}
                  </Text>
                  <Text className="text-xs mt-1" style={{ color: '#ffffffcc', fontFamily: 'System' }}>
                    {item.timestamp}
                  </Text>
                </View>
                );
              }}
            />
          )}

          {/* Quick Replies - For both buyers and sellers */}
          {!isComplete && !loading && (
            <View className="px-4 pb-2">
              <FlatList
                horizontal
                data={isSeller ? SELLER_QUICK_REPLIES : BUYER_QUICK_REPLIES}
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="px-4 py-2 rounded-full mr-2"
                    style={{ backgroundColor: '#2C4A34' }}
                    onPress={() => sendMessage(item)}
                    disabled={sending}
                  >
                    <Text className="text-sm font-semibold" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Input - Fixed at bottom */}
          <View
            className="flex-row items-end px-4"
            style={{
              paddingTop: 8,
              paddingBottom: 8,
              backgroundColor: '#365441',
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: '#ffffff',
                borderRadius: 24,
                paddingHorizontal: 16,
                paddingVertical: 12,
                marginRight: 12,
                maxHeight: 100,
              }}
            >
              <TextInput
                placeholder="Type a message"
                placeholderTextColor="#6b7280"
                value={input}
                onChangeText={setInput}
                style={{ color: '#2C4A34', fontFamily: 'System', fontSize: 15 }}
                multiline
                editable={!sending}
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
                opacity: sending ? 0.7 : 1,
              }}
              onPress={() => sendMessage(input)}
              disabled={sending || !input.trim()}
            >
              {sending ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text className="text-white font-semibold" style={{ fontFamily: 'System' }}>
                  Send
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
