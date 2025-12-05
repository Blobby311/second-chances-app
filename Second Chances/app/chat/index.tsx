import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar, Image, TextInput, Animated, PanResponder, Dimensions, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Menu, Search, Trash2, Leaf, MessageCircle } from 'lucide-react-native';
import '../../global.css';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 100;
const DELETE_BUTTON_WIDTH = 80;

// TODO: Replace with API call
// Buyer data matching the chat/[id].tsx file
const BUYER_DATA = [
  {
    id: 'b1',
    name: 'Ahmad bin Abdullah',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=60',
  },
  {
    id: 'b2',
    name: 'Siti Nurhaliza binti Ahmad',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=60',
  },
  {
    id: 'b3',
    name: 'Lim Wei Ming',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=60',
  },
  {
    id: 'b4',
    name: 'Raj Kumar a/l Muthu',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=60',
  },
];

// Seller data for buyer-side chats
const SELLER_DATA = [
  {
    id: 's1',
    name: 'Uncle Roger',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa3du6j726GP7-rDxHda8-FYopWptm3LsTWA&s',
  },
  {
    id: 's2',
    name: 'Kak Siti',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=60',
  },
];

// Chat list data - SELLER SIDE shows chats with buyers
// All chats must be with buyers (chatId starts with 'b')
const SELLER_CHATS_DATA = [
  {
    id: '1',
    name: 'Ahmad bin Abdullah',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=60',
    lastMessage: 'Is the item available?',
    timestamp: '10:30 AM',
    orderTag: 'Order #123',
    isUnread: true,
    chatId: 'b1',
  },
  {
    id: '2',
    name: 'Siti Nurhaliza binti Ahmad',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=60',
    lastMessage: 'Thanks for the update!',
    timestamp: 'Yesterday',
    orderTag: null,
    isUnread: false,
    chatId: 'b2',
  },
  {
    id: '3',
    name: 'Lim Wei Ming',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=60',
    lastMessage: 'When can I pick it up?',
    timestamp: '2 days ago',
    orderTag: 'Order #456',
    isUnread: true,
    chatId: 'b3',
  },
  {
    id: '4',
    name: 'Raj Kumar a/l Muthu',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=60',
    lastMessage: 'Perfect, see you then!',
    timestamp: '3 days ago',
    orderTag: null,
    isUnread: false,
    chatId: 'b4',
  },
];

// Chat list data - BUYER SIDE shows chats with sellers
// All chats must be with sellers (chatId starts with 's')
const BUYER_CHATS_DATA = [
  {
    id: '1',
    name: 'Uncle Roger',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa3du6j726GP7-rDxHda8-FYopWptm3LsTWA&s',
    lastMessage: 'When would you like to pick it up?',
    timestamp: '11:45 AM',
    orderTag: 'Order #XM12345',
    isUnread: true,
    chatId: 's1',
  },
  {
    id: '2',
    name: 'Kak Siti',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=60',
    lastMessage: 'Your order is ready!',
    timestamp: 'Yesterday',
    orderTag: null,
    isUnread: false,
    chatId: 's2',
  },
];

export default function ChatListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  
  // TODO: Detect user role from auth/session
  // If role param is 'buyer', show seller chats (buyer talks to sellers)
  // If role param is 'seller', show buyer chats (seller talks to buyers)
  const isBuyer = params.role !== 'seller'; // Default to buyer if no role specified
  
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sellerChats, setSellerChats] = useState(SELLER_CHATS_DATA);
  const [buyerChats, setBuyerChats] = useState(BUYER_CHATS_DATA);
  const [swipedItemId, setSwipedItemId] = useState<string | null>(null);
  const translateXRefs = useRef<{ [key: string]: Animated.Value }>({});

  // Use buyer chats if user is buyer, seller chats if user is seller
  const chats = isBuyer ? buyerChats : sellerChats;

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

  const handleDelete = (chatId: string) => {
    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete this chat?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (isBuyer) {
              setBuyerChats(buyerChats.filter(chat => chat.id !== chatId));
            } else {
              setSellerChats(sellerChats.filter(chat => chat.id !== chatId));
            }
            setSwipedItemId(null);
            if (translateXRefs.current[chatId]) {
              translateXRefs.current[chatId].setValue(0);
            }
          },
        },
      ]
    );
  };

  const handleChatPress = (chat: typeof SELLER_CHATS_DATA[0] | typeof BUYER_CHATS_DATA[0]) => {
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
    router.push(`/chat/${chat.chatId}`);
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

  const renderChatItem = ({ item }: { item: typeof SELLER_CHATS_DATA[0] | typeof BUYER_CHATS_DATA[0] }) => {
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
              }}
            >
              <Image
                source={{ uri: item.avatar }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
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
        <FlatList
          data={filteredChats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20 }}
          ListEmptyComponent={renderEmptyState}
        />
      </View>
    </View>
  );
}
