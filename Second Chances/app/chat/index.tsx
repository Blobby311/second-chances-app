import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar, Image, TextInput, Animated, PanResponder, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Menu, Search, Trash2, Leaf, MessageCircle } from 'lucide-react-native';
import '../../global.css';
import { API_URL } from '../../config/api';
import { getAuthToken } from '../../config/auth';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 100;
const DELETE_BUTTON_WIDTH = 80;

// Sample chats for testing/fallback
const SAMPLE_BUYER_CHATS: ChatItem[] = [
  {
    id: 'sample-1',
    name: 'Uncle Roger',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa3du6j726GP7-rDxHda8-FYopWptm3LsTWA&s',
    lastMessage: 'Your order is ready for pickup!',
    timestamp: 'Just now',
    orderTag: 'Order #123',
    isUnread: true,
    chatId: 'sample-1',
  },
  {
    id: 'sample-2',
    name: 'Kak Siti',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=60',
    lastMessage: 'Thank you for your order!',
    timestamp: '2h ago',
    orderTag: null,
    isUnread: false,
    chatId: 'sample-2',
  },
];

const SAMPLE_SELLER_CHATS: ChatItem[] = [
  {
    id: 'sample-b1',
    name: 'Ahmad bin Abdullah',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=60',
    lastMessage: 'Is the item available?',
    timestamp: 'Just now',
    orderTag: 'Order #456',
    isUnread: true,
    chatId: 'sample-b1',
  },
  {
    id: 'sample-b2',
    name: 'Siti Nurhaliza',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=60',
    lastMessage: 'When can I pick it up?',
    timestamp: '1h ago',
    orderTag: null,
    isUnread: false,
    chatId: 'sample-b2',
  },
];

interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  orderTag: string | null;
  isUnread: boolean;
  chatId: string;
}

export default function ChatListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  
  // TODO: Detect user role from auth/session
  // If role param is 'buyer', show seller chats (buyer talks to sellers)
  // If role param is 'seller', show buyer chats (seller talks to buyers)
  const isBuyer = params.role !== 'seller'; // Default to buyer if no role specified
  
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [swipedItemId, setSwipedItemId] = useState<string | null>(null);
  const translateXRefs = useRef<{ [key: string]: Animated.Value }>({});

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

  // Load chats from API
  const loadChats = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const role = isBuyer ? 'buyer' : 'seller';
      const url = `${API_URL}/api/chat?role=${role}`;
      console.log('Fetching chats from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Chat API response status:', response.status);

      // Handle 404 as empty chats - show sample chats for testing
      if (response.status === 404) {
        console.log('No chats found (404) - showing sample chats for testing');
        setChats(isBuyer ? SAMPLE_BUYER_CHATS : SAMPLE_SELLER_CHATS);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        const errorMessage = errorData?.error || errorData?.message || `Failed with status ${response.status}`;
        console.error('Chat API error:', response.status, errorMessage, errorData);
        // For other errors, show sample chats for testing
        console.log('Showing sample chats due to API error');
        setChats(isBuyer ? SAMPLE_BUYER_CHATS : SAMPLE_SELLER_CHATS);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log('Chat API data received:', data);
      
      // Handle empty array or non-array response
      if (!Array.isArray(data)) {
        console.warn('Invalid chat data format, expected array:', data);
        setChats([]);
        return;
      }

      // If there are no real chats yet, fall back to our sample dummy chats
      if (data.length === 0) {
        console.log('No chats in API response - showing sample chats');
        setChats(isBuyer ? SAMPLE_BUYER_CHATS : SAMPLE_SELLER_CHATS);
        return;
      }

      // Format chats
      const formattedChats: ChatItem[] = data.map((chat: any) => {
        const partner = isBuyer ? chat.seller : chat.buyer;
        const lastMessageContent = chat.lastMessage?.content || 'No messages yet';
        const unreadCount = isBuyer ? chat.unreadCount?.buyer || 0 : chat.unreadCount?.seller || 0;

        return {
          id: chat._id || chat.id,
          name: partner?.name || 'User',
          avatar: partner?.avatar || '',
          lastMessage: lastMessageContent,
          timestamp: formatTimestamp(chat.lastMessageAt || chat.createdAt),
          orderTag: null, // TODO: Get order tag from order if linked
          isUnread: unreadCount > 0,
          chatId: chat._id || chat.id,
        };
      });

      setChats(formattedChats);
      console.log('Chats loaded successfully:', formattedChats.length, 'chats');
    } catch (error: any) {
      console.error('Error loading chats:', error);
      console.error('Error details:', {
        message: error?.message,
        stack: error?.stack,
        role: isBuyer ? 'buyer' : 'seller',
        apiUrl: API_URL,
      });
      // On error, show sample chats for testing
      console.log('Showing sample chats due to error');
      setChats(isBuyer ? SAMPLE_BUYER_CHATS : SAMPLE_SELLER_CHATS);
    } finally {
      setLoading(false);
    }
  }, [isBuyer]);

  // Load chats on mount and when screen is focused
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useFocusEffect(
    useCallback(() => {
      loadChats();
    }, [loadChats])
  );

  const filteredChats = chats.filter((chat) => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || (activeTab === 'unread' && chat.isUnread);
    return matchesSearch && matchesTab;
  });

  // Initialize translateX for each item
  filteredChats.forEach((chat) => {
    if (!translateXRefs.current[chat.id]) {
      translateXRefs.current[chat.id] = new Animated.Value(0);
    }
  });

  const handleDelete = async (chatId: string) => {
    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete this chat?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = getAuthToken();
              if (!token) {
                Alert.alert('Authentication Error', 'Please log in again.');
                return;
              }

              const response = await fetch(`${API_URL}/api/chat/${chatId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              });

              if (!response.ok) {
                throw new Error('Failed to delete chat');
              }

              // Refresh chat list
              await loadChats();
              setSwipedItemId(null);
              if (translateXRefs.current[chatId]) {
                translateXRefs.current[chatId].setValue(0);
              }
            } catch (error: any) {
              console.error('Error deleting chat:', error);
              Alert.alert('Error', `Failed to delete chat: ${error.message}`);
            }
          },
        },
      ]
    );
  };

  const handleChatPress = (chat: ChatItem) => {
    // Close any swiped items first
    if (swipedItemId) {
      const translateX = translateXRefs.current[swipedItemId];
      if (translateX) {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
      setSwipedItemId(null);
    }
    // Use canonical chatId (if provided) to avoid mismatches between id/chatId
    const targetId = (chat as any).chatId || chat.id;
    const navPath = `/chat/${encodeURIComponent(targetId)}?name=${encodeURIComponent(chat.name)}`;
    console.log('[ChatList] handleChatPress -> navigating to', { targetId, name: chat.name, navPath });
    router.push(navPath);
  };

  const createPanResponder = (itemId: string) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderGrant: () => {
        // Close other swiped items
        if (swipedItemId && swipedItemId !== itemId) {
          const translateX = translateXRefs.current[swipedItemId];
          if (translateX) {
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        }
        setSwipedItemId(itemId);
      },
      onPanResponderMove: (_, gestureState) => {
        const translateX = translateXRefs.current[itemId];
        if (translateX) {
          if (gestureState.dx < 0) {
            translateX.setValue(Math.max(gestureState.dx, -DELETE_BUTTON_WIDTH));
          } else {
            translateX.setValue(Math.min(gestureState.dx, 0));
          }
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const translateX = translateXRefs.current[itemId];
        if (translateX) {
          if (gestureState.dx < -SWIPE_THRESHOLD) {
            Animated.spring(translateX, {
              toValue: -DELETE_BUTTON_WIDTH,
              useNativeDriver: true,
            }).start();
            setSwipedItemId(itemId);
          } else {
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
            setSwipedItemId(null);
          }
        }
      },
    });
  };

  const renderChatItem = ({ item }: { item: ChatItem }) => {
    const translateX = translateXRefs.current[item.id] || new Animated.Value(0);
    const panResponder = createPanResponder(item.id);

    return (
      <View style={{ position: 'relative', marginBottom: 12, overflow: 'hidden', borderRadius: 12, width: SCREEN_WIDTH - 32 }}>
        {/* Delete Button - Hidden behind chat item */}
        <View
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: DELETE_BUTTON_WIDTH,
            backgroundColor: '#C85E51',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 0,
          }}
        >
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 16,
            }}
          >
            <Trash2 size={20} stroke="#ffffff" style={{ marginRight: 4 }} />
            <Text className="text-sm font-semibold" style={{ color: '#ffffff', fontFamily: 'System' }}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>

        {/* Chat Item - Covers delete button when not swiped */}
        <Animated.View
          style={{
            transform: [{ translateX }],
            zIndex: 1,
            backgroundColor: '#E8F3E0',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#2C4A34',
            width: '100%',
          }}
          {...panResponder.panHandlers}
        >
          <TouchableOpacity
            onPress={() => handleChatPress(item)}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              backgroundColor: '#E8F3E0',
            }}
          >
            {/* Profile Picture */}
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                overflow: 'hidden',
                marginRight: 12,
                backgroundColor: '#E8F3E0',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {item.avatar ? (
                <Image
                  source={{ uri: item.avatar }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              ) : (
                <Text className="text-lg font-semibold" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                  {item.name[0]}
                </Text>
              )}
            </View>

            {/* Chat Info */}
            <View style={{ flex: 1 }}>
              <View className="flex-row items-center mb-1" style={{ flexWrap: 'wrap' }}>
                <Text className="text-base font-bold" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                  {item.name}
                </Text>
                {item.orderTag && (
                  <View
                    className="ml-2 px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: '#E8F3E0' }}
                  >
                    <Text className="text-xs font-semibold" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                      {item.orderTag}
                    </Text>
                  </View>
                )}
              </View>
              <Text 
                className="text-sm" 
                numberOfLines={1}
                style={{ 
                  color: '#2C4A34',
                  fontFamily: 'System',
                }}
              >
                {item.lastMessage}
              </Text>
            </View>

            {/* Timestamp and Unread Indicator */}
            <View className="items-end" style={{ marginLeft: 8 }}>
              <Text className="text-xs mb-1" style={{ color: '#6b7280', fontFamily: 'System' }}>
                {item.timestamp}
              </Text>
              {item.isUnread && (
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#2C4A34',
                  }}
                />
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View className="items-center justify-center" style={{ paddingTop: 100, flex: 1 }}>
      <View style={{ position: 'relative', width: 80, height: 80, alignItems: 'center', justifyContent: 'center' }}>
        <MessageCircle size={80} stroke="#2C4A34" strokeWidth={1.5} />
        <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
          <Leaf size={24} stroke="#2C4A34" strokeWidth={1.5} />
        </View>
      </View>
      <Text className="text-base mt-4" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
        No chats yet.
      </Text>
      <Text className="text-base" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
        Start a conversation!
      </Text>
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: '#365441' }}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4"
        style={{ backgroundColor: '#2C4A34', paddingTop: 60, paddingBottom: 12 }}
      >
        <TouchableOpacity onPress={() => router.push(isBuyer ? '/(buyer)/menu' : '/(seller)/menu')}>
          <Menu size={24} stroke="#ffffff" />
        </TouchableOpacity>
        <Text className="text-xl font-bold" style={{ color: '#ffffff', fontFamily: 'System' }}>
          Chats
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar and Segmented Control */}
      <View className="px-4 py-3" style={{ backgroundColor: '#365441' }}>
        {/* Search Bar */}
        <View
          className="flex-row items-center px-4 rounded-2xl mb-3"
          style={{
            backgroundColor: '#E8F3E0',
            borderWidth: 1,
            borderColor: '#2C4A34',
            height: 40,
          }}
        >
          <Search size={18} stroke="#2C4A34" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search chats..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1"
            style={{
              color: '#2C4A34',
              fontFamily: 'System',
              fontSize: 14,
            }}
            placeholderTextColor="#6b7280"
          />
        </View>

        {/* Segmented Control */}
        <View
          className="flex-row rounded-full"
          style={{
            backgroundColor: '#E8F3E0',
            padding: 4,
            borderWidth: 1,
            borderColor: '#2C4A34',
          }}
        >
          <TouchableOpacity
            onPress={() => setActiveTab('all')}
            className="flex-1 items-center justify-center py-2 rounded-full"
            style={{
              backgroundColor: activeTab === 'all' ? '#2C4A34' : 'transparent',
            }}
          >
            <Text
              className="text-sm font-semibold"
              style={{
                color: activeTab === 'all' ? '#E8F3E0' : '#2C4A34',
                fontFamily: 'System',
              }}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('unread')}
            className="flex-1 items-center justify-center py-2 rounded-full"
            style={{
              backgroundColor: activeTab === 'unread' ? '#2C4A34' : 'transparent',
            }}
          >
            <Text
              className="text-sm font-semibold"
              style={{
                color: activeTab === 'unread' ? '#E8F3E0' : '#2C4A34',
                fontFamily: 'System',
              }}
            >
              Unread
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat List */}
      <View style={{ flex: 1, backgroundColor: '#365441' }}>
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#E8F3E0" />
          </View>
        ) : (
          <FlatList
            data={filteredChats}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20 }}
            ListEmptyComponent={renderEmptyState}
          />
        )}
      </View>
    </View>
  );
}
