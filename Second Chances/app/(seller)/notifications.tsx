import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, PanResponder, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, Bell } from 'lucide-react-native';
import '../../global.css';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// TODO: Replace with API call
const NOTIFICATIONS_DATA = [
  {
    id: '1',
    type: 'order', // order, product, buyer
    message: "You received a new order from buyer 'Ahmad'. Tap to view details!",
    isUnread: true,
    relatedId: '1', // order ID
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRQEytqdym2soe7nH5Tqqe4X1GvyNbDbUs0A&s', // product image
  },
  {
    id: '2',
    type: 'product',
    message: "Your blind box 'Veggie Haul Mix' has favorited by 5 people!",
    isUnread: true,
    relatedId: '1', // product ID
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRQEytqdym2soe7nH5Tqqe4X1GvyNbDbUs0A&s', // product image
  },
  {
    id: '3',
    type: 'order',
    message: "Blindbox 'Fruits Galore' has been delivered successfully.",
    isUnread: false,
    relatedId: '4', // order ID
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSimGyJxyM2BpGcrcv9_b_lskXGFHA_TPoOw&s', // product image
  },
  {
    id: '4',
    type: 'buyer',
    message: "Buyer 'Siti Nurhaliza' left a 5-star review!",
    isUnread: false,
    relatedId: 'b2', // buyer ID
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=60', // buyer avatar
  },
  {
    id: '5',
    type: 'order',
    message: "New order from 'Lim Wei Ming' - Blindbox Fruit Basket",
    isUnread: true,
    relatedId: '3', // order ID
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0NTZmv6zIanNf621NF_dJQNoCb4eYQNAAzQ&s', // product image
  },
  {
    id: '6',
    type: 'product',
    message: "Your blind box 'Sunrise Fruit Crate' is running low on stock!",
    isUnread: false,
    relatedId: '2', // product ID
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSimGyJxyM2BpGcrcv9_b_lskXGFHA_TPoOw&s', // product image
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
          router.push('/(seller)/menu');
        }
      },
    })
  ).current;
  
  // Separate unread and read notifications
  const unreadNotifications = NOTIFICATIONS_DATA.filter(item => item.isUnread);
  const readNotifications = NOTIFICATIONS_DATA.filter(item => !item.isUnread);

  const handleNotificationPress = (item: typeof NOTIFICATIONS_DATA[0]) => {
    if (item.type === 'order') {
      router.push(`/(seller)/order-detail/${item.relatedId}`);
    } else if (item.type === 'product') {
      router.push('/(seller)/stock');
    } else if (item.type === 'buyer') {
      router.push(`/buyer-profile/${item.relatedId}`);
    }
  };

  const renderNotificationItem = ({ item }: { item: typeof NOTIFICATIONS_DATA[0] }) => (
    <TouchableOpacity
      onPress={() => handleNotificationPress(item)}
      className="flex-row items-start p-4 rounded-3xl mb-4"
      style={{ 
        backgroundColor: item.isUnread ? '#E8F3E0' : '#E8F3E0',
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
        {/* Unread indicator dot */}
        {item.isUnread && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: '#C85E51',
              borderWidth: 2,
              borderColor: '#ffffff',
              zIndex: 1,
            }}
          />
        )}

        {/* Related Image */}
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: 70, height: 70, borderRadius: 35 }}
            resizeMode="cover"
          />
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
        <TouchableOpacity onPress={() => router.push('/(seller)/menu')} className="mr-3">
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

