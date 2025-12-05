import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import '../../global.css';

// TODO: Replace with real-time chat data
// Messages for each buyer/seller - must match lastMessage in chat list
const CHAT_MESSAGES: { [key: string]: Array<{ id: string; sender: 'seller' | 'buyer'; content: string; timestamp: string }> } = {
  'b1': [
    { id: 'm1', sender: 'seller', content: 'Hi Ahmad! Your order is ready for pickup.', timestamp: '10:25 AM' },
    { id: 'm2', sender: 'buyer', content: 'Is the item available?', timestamp: '10:30 AM' },
  ],
  'b2': [
    { id: 'm1', sender: 'seller', content: 'Your order has been shipped!', timestamp: 'Yesterday' },
    { id: 'm2', sender: 'buyer', content: 'Thanks for the update!', timestamp: 'Yesterday' },
  ],
  'b3': [
    { id: 'm1', sender: 'seller', content: 'Your order is ready for pickup.', timestamp: '2 days ago' },
    { id: 'm2', sender: 'buyer', content: 'When can I pick it up?', timestamp: '2 days ago' },
  ],
  'b4': [
    { id: 'm1', sender: 'seller', content: 'See you at 3 PM!', timestamp: '3 days ago' },
    { id: 'm2', sender: 'buyer', content: 'Perfect, see you then!', timestamp: '3 days ago' },
  ],
  's1': [
    { id: 'm1', sender: 'seller', content: 'Hi! Thank you for rescuing this box!', timestamp: 'Just now' },
    { id: 'm2', sender: 'seller', content: 'When would you like to pick it up?', timestamp: 'Just now' },
  ],
  's2': [
    { id: 'm1', sender: 'seller', content: 'Hello! Your order is confirmed.', timestamp: 'Just now' },
    { id: 'm2', sender: 'seller', content: 'Looking forward to meeting you!', timestamp: 'Just now' },
  ],
};

const BUYER_QUICK_REPLIES = ['Is 5 PM okay?', "I'm here", 'Thank you!'];
const SELLER_QUICK_REPLIES = ['Your order is ready!', 'When can you pick up?', 'Thank you for your order!'];

// TODO: Replace with API call
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
  {
    id: 'b5',
    name: 'Fatimah binti Ali',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=60',
  },
  {
    id: 'b6',
    name: 'Tan Ah Beng',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=60',
  },
];

const SELLERS = [
  {
    id: 's1',
    name: 'Uncle Roger',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa3du6j726GP7-rDxHda8-FYopWptm3LsTWA&s',
    online: true,
  },
  {
    id: 's2',
    name: 'Kak Siti',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=60',
    online: true,
  },
  {
    id: 'default',
    name: 'Neighbor',
    avatar: '',
    online: false,
  },
];

export default function ChatScreen() {
  const { id, orderId } = useLocalSearchParams<{ id: string; orderId?: string }>();
  const router = useRouter();
  
  // Get initial messages for this specific chat based on buyer/seller ID
  const getInitialMessages = () => {
    if (id) {
      return CHAT_MESSAGES[id] || CHAT_MESSAGES['b1']; // Default to b1 if not found
    }
    return CHAT_MESSAGES['b1'];
  };
  
  const [messages, setMessages] = useState(getInitialMessages());
  const [input, setInput] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  // Update messages when ID changes
  useEffect(() => {
    if (id) {
      const newMessages = CHAT_MESSAGES[id] || CHAT_MESSAGES['b1'];
      setMessages(newMessages);
    }
  }, [id]);

  // Determine current user's role and chat partner
  // If ID starts with 'b', current user is seller (chatting with buyer)
  // If ID starts with 's', current user is buyer (chatting with seller)
  const isSeller = useMemo(() => {
    return id?.startsWith('b');
  }, [id]);

  const currentUserRole = isSeller ? 'seller' : 'buyer';
  const chatPartnerRole = isSeller ? 'buyer' : 'seller';

  const chatPartnerDetails = useMemo(() => {
    // If seller is chatting with buyer (ID starts with 'b')
    if (id?.startsWith('b')) {
      const buyer = BUYER_DATA.find((buyer) => buyer.id === id);
      if (buyer) {
        return {
          name: buyer.name,
          avatar: buyer.avatar,
          online: true,
        };
      }
    }
    // If buyer is chatting with seller (ID starts with 's')
    if (id?.startsWith('s')) {
      const seller = SELLERS.find((seller) => seller.id === id);
      if (seller) {
        return seller;
      }
    }
    // Default fallback
    return {
      name: 'User',
      avatar: '',
      online: false,
    };
  }, [id]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { 
      id: `${Date.now()}`, 
      sender: currentUserRole, 
      content: text, 
      timestamp: 'Now' 
    }]);
    setInput('');
  };

  const handleCompleteTransaction = () => {
    // TODO: Mark transaction as complete via API
    setIsComplete(true);
    // Navigate to rating screen
    const order = orderId || `order-${Date.now()}`;
    router.push({
      pathname: '/rating/[orderId]',
      params: { orderId: order, sellerId: id },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#365441' }} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
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
                // Only navigate to seller profile if chatting with a seller (id starts with 's')
                if (id && id.startsWith('s')) {
                  router.push(`/seller-profile/${id}`);
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
          <FlatList
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

          {/* Quick Replies - For both buyers and sellers */}
          {!isComplete && (
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
              paddingBottom: Platform.OS === 'ios' ? 8 : 8,
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
              }}
              onPress={() => sendMessage(input)}
            >
              <Text className="text-white font-semibold" style={{ fontFamily: 'System' }}>
                Send
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

