import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, PanResponder, Dimensions, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, Bell, Coins } from 'lucide-react-native';
import '../../global.css';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Badge image mapping - for reward notifications
const BADGE_IMAGES: { [key: string]: any } = {
  'eco-hero.png': require('../../assets/badges/eco-hero.png'),
  'loyal.png': require('../../assets/badges/loyal.png'),
  'regular.png': require('../../assets/badges/regular.png'),
  'gold.png': require('../../assets/badges/gold.png'),
};

// TODO: Replace with API call
const NOTIFICATIONS_DATA = [
  {
    id: '1',
    type: 'order', // order, product, reward, favorite
    message: "Your 'Rescued Veggie Box' is ready for pickup! Contact Uncle Roger to arrange pickup.",
    isUnread: true,
    relatedId: '1', // order ID
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRQEytqdym2soe7nH5Tqqe4X1GvyNbDbUs0A&s',
    badgeImage: null,
  },
  {
    id: '2',
    type: 'reward',
    message: "Congratulations! You've earned a new badge: 'Eco Hero' for rescuing 20+ boxes!",
    isUnread: true,
    relatedId: null,
    imageUrl: null,
    badgeImage: 'eco-hero.png',
  },
  {
    id: '3',
    type: 'order',
    message: "Your 'Sunrise Fruit Crate' has been delivered successfully. Don't forget to rate your experience!",
    isUnread: false,
    relatedId: '2', // order ID
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSimGyJxyM2BpGcrcv9_b_lskXGFHA_TPoOw&s',
    badgeImage: null,
  },
  {
    id: '4',
    type: 'favorite',
    message: "Great news! Your favorited 'Organic Veg Rescue' is back in stock nearby.",
    isUnread: false,
    relatedId: null, // product ID unavailable in demo data
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0NTZmv6zIanNf621NF_dJQNoCb4eYQNAAzQ&s',
    badgeImage: null,
  },
  {
    id: '5',
    type: 'reward',
    message: "You have 100 points expiring soon! Use them at checkout or redeem rewards.",
    isUnread: true,
    relatedId: null,
    imageUrl: null,
    badgeImage: null, // Generic points notification - use coins icon
  },
  {
    id: '6',
    type: 'product',
    message: "New blindbox available near you: 'Fresh Fruit Basket' - Only 2km away!",
    isUnread: false,
    relatedId: null, // product ID unavailable in demo data
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRQEytqdym2soe7nH5Tqqe4X1GvyNbDbUs0A&s',
    badgeImage: null,
  },
  {
    id: '7',
    type: 'product',
    message: "Limited time community gift: 'Neighbor's Free Gift'",
    isUnread: false,
    relatedId: null,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmAps3JJfGUb6r7bvZZL6zHjAzgxvMvD2Ijg&s',
    badgeImage: null,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  
  // PanResponder for swipe-to-open menu
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dx > 0 && evt.nativeEvent.pageX < 50;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > SCREEN_WIDTH * 0.3) {
          router.push('/(buyer)/menu');
        }
      },
    })
  ).current;
  
  // Separate unread and read notifications
  const unreadNotifications = NOTIFICATIONS_DATA.filter(item => item.isUnread);
  const readNotifications = NOTIFICATIONS_DATA.filter(item => !item.isUnread);

  const handleNotificationPress = (item: typeof NOTIFICATIONS_DATA[0]) => {
    if (item.type === 'order') {
      // Navigate to order detail or my orders page
      router.push(`/(buyer)/my-orders`);
    } else if (item.type === 'product') {
      // Navigate to product detail if we have a valid ID, otherwise home
      if (item.relatedId && /^[0-9a-fA-F]{24}$/.test(item.relatedId)) {
        router.push({
          pathname: '/product/[id]',
          params: { id: item.relatedId },
        });
      } else {
        Alert.alert('Cannot open product', 'This product is not available to view.');
      }
    } else if (item.type === 'favorite') {
      // Navigate to favorites
      router.push('/(buyer)/favorites');
    } else if (item.type === 'reward') {
      // Navigate to rewards page
      router.push('/(buyer)/rewards');
    }
  };

  const renderNotificationItem = ({ item }: { item: typeof NOTIFICATIONS_DATA[0] }) => (
    <TouchableOpacity
      onPress={() => handleNotificationPress(item)}
      className="flex-row items-start p-4 rounded-3xl mb-4"
      style={{ 
        backgroundColor: '#E8F3E0',
        borderWidth: 1,
        borderColor: '#2C4A34',
        minHeight: 100,
        opacity: item.isUnread ? 1 : 0.7,
      }}
    >
      {/* Image - Circular with unread indicator */}
      <View 
        style={{ 
          width: 70, 
          height: 70, 
          borderRadius: 35,
          backgroundColor: '#ffffff',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
          position: 'relative',
          overflow: 'hidden',
          borderWidth: 2,
        borderColor: '#2C4A34',
      }}
    >
      {/* Related Image */}
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: 70, height: 70, borderRadius: 35 }}
            resizeMode="cover"
          />
        ) : item.badgeImage ? (
          <Image
            source={BADGE_IMAGES[item.badgeImage]}
            style={{ width: 70, height: 70, borderRadius: 35 }}
            resizeMode="contain"
          />
        ) : item.type === 'reward' ? (
          <View 
            style={{ 
              width: 70, 
              height: 70, 
              borderRadius: 35,
              backgroundColor: '#facc15',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Coins size={32} stroke="#2C4A34" strokeWidth={2} />
          </View>
        ) : (
          <View 
            style={{ 
              width: 70, 
              height: 70, 
              borderRadius: 35,
              backgroundColor: '#2C4A34',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bell size={28} stroke="#E8F3E0" />
          </View>
        )}
      </View>

      {/* Notification Message */}
      <View className="flex-1">
        <Text className="text-base" style={{ color: '#2C4A34', fontFamily: 'System', lineHeight: 22 }}>
          {item.message}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: '#365441' }}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View 
        className="flex-row items-center px-4"
        style={{ backgroundColor: '#2C4A34', paddingTop: 60, paddingBottom: 12 }}
      >
        <TouchableOpacity onPress={() => router.push('/(buyer)/menu')} className="mr-3">
          <Menu size={24} stroke="#ffffff" />
        </TouchableOpacity>
        <Text className="text-xl font-bold flex-1 text-center" style={{ color: '#ffffff', fontFamily: 'System' }}>
          Notifications
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Notifications List */}
      <View
        style={{ flex: 1 }}
        {...panResponder.panHandlers}
      >
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          style={{ backgroundColor: '#365441' }}
        >
        {/* Unread Notifications Section */}
        {unreadNotifications.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-4" style={{ color: '#ffffff', fontFamily: 'System' }}>
              Unread
            </Text>
            {unreadNotifications.map((item) => (
              <React.Fragment key={item.id}>
                {renderNotificationItem({ item })}
              </React.Fragment>
            ))}
          </View>
        )}

        {/* Read Notifications Section */}
        {readNotifications.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-4" style={{ color: '#ffffff', fontFamily: 'System' }}>
              Read
            </Text>
            {readNotifications.map((item) => (
              <React.Fragment key={item.id}>
                {renderNotificationItem({ item })}
              </React.Fragment>
            ))}
          </View>
        )}

        {/* Clear All Button */}
        <View 
          className="items-center py-4 mt-4"
        >
          <TouchableOpacity
            onPress={() => {
              // TODO: Handle clear all action
              console.log('Clear all notifications');
            }}
            className="px-6 py-3 rounded-3xl"
            style={{ backgroundColor: '#C85E51' }}
          >
            <Text className="text-base font-semibold" style={{ color: '#ffffff', fontFamily: 'System' }}>
              Clear All
            </Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </View>
    </View>
  );
}
