import React, { useState, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar, Image, PanResponder, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, Check, X } from 'lucide-react-native';
import '../../global.css';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// TODO: Replace with API call
const ORDERS_DATA = {
  'To Ship': [
    {
      id: '1',
      productName: 'Blindbox Veggie Mix',
      orderId: '#XM12345',
      deliveryMethod: 'Self Pick Up @ Farm',
      total: 'RM15',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRQEytqdym2soe7nH5Tqqe4X1GvyNbDbUs0A&s',
    },
    {
      id: '2',
      productName: 'Blindbox Fruit Basket',
      orderId: '#YM67890',
      deliveryMethod: 'Self Pick Up @ Collect Hub',
      total: 'RM12',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSimGyJxyM2BpGcrcv9_b_lskXGFHA_TPoOw&s',
    },
    {
      id: '3',
      productName: 'Blindbox Fruit Basket',
      orderId: '#YM67891',
      deliveryMethod: 'Doorstep Delivery',
      total: 'RM15',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0NTZmv6zIanNf621NF_dJQNoCb4eYQNAAzQ&s',
    },
  ],
  'Delivered': [
    {
      id: '4',
      productName: 'Blindbox Random Haul',
      orderId: '#ZN11223',
      deliveryMethod: 'Doorstep Delivery',
      total: 'RM18',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmAps3JJfGUb6r7bvZZL6zHjAzgxvMvD2Ijg&s',
    },
    {
      id: '5',
      productName: 'Blindbox Veggie Mix',
      orderId: '#XM12346',
      deliveryMethod: 'Self Pick Up @ Farm',
      total: 'RM15',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRQEytqdym2soe7nH5Tqqe4X1GvyNbDbUs0A&s',
    },
  ],
  'Cancelled': [
    {
      id: '6',
      productName: 'Blindbox Fruit Basket',
      orderId: '#YM67892',
      deliveryMethod: 'Self Pick Up @ Collect Hub',
      total: 'RM12',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSimGyJxyM2BpGcrcv9_b_lskXGFHA_TPoOw&s',
    },
  ],
};

const TABS = ['To Ship', 'Delivered', 'Cancelled'];

export default function OrdersScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('To Ship');
  
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

  // Filter orders based on selected tab
  const filteredData = useMemo(() => {
    return ORDERS_DATA[selectedTab as keyof typeof ORDERS_DATA] || [];
  }, [selectedTab]);

  const renderOrderItem = ({ item }: { item: typeof ORDERS_DATA['To Ship'][0] }) => (
    <TouchableOpacity
      onPress={() => router.push(`/(seller)/order-detail/${item.id}`)}
      className="flex-row items-center p-4 rounded-3xl mb-4"
      style={{ 
        backgroundColor: '#E8F3E0',
        borderWidth: 1,
        borderColor: '#2C4A34',
        minHeight: 120,
      }}
    >
      {/* Product Image */}
      <View 
        style={{ 
          width: 80, 
          height: 80, 
          borderRadius: 12,
          marginRight: 12,
          overflow: 'hidden',
          backgroundColor: '#FDFBF5',
        }}
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
          onError={() => {}}
        />
      </View>

      {/* Details */}
      <View className="flex-1">
        <Text className="text-base font-bold mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
          {item.productName}
        </Text>
        <Text className="text-sm mb-1" style={{ color: '#6b7280', fontFamily: 'System' }}>
          {item.orderId}
        </Text>
        {item.deliveryMethod && (
          <Text 
            className="text-sm mb-1" 
            numberOfLines={2}
            style={{ color: '#6b7280', fontFamily: 'System' }}
          >
            {item.deliveryMethod}
          </Text>
        )}
        <Text className="text-base font-bold mt-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
          {item.total}
        </Text>
      </View>

      {/* Checkmark Icon for Delivered orders */}
      {selectedTab === 'Delivered' && (
        <View 
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: '#2C4A34',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 8,
          }}
        >
          <Check size={20} stroke="#E8F3E0" />
        </View>
      )}

      {/* X Icon for Cancelled orders */}
      {selectedTab === 'Cancelled' && (
        <View 
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: '#C85E51',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 8,
          }}
        >
          <X size={20} stroke="#E8F3E0" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: '#365441' }}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4"
        style={{ backgroundColor: '#2C4A34', paddingTop: 60, paddingBottom: 12 }}
      >
        <TouchableOpacity onPress={() => router.push('/(seller)/menu')}>
          <Menu size={24} stroke="#ffffff" />
        </TouchableOpacity>
        <Text className="text-xl font-bold" style={{ color: '#ffffff', fontFamily: 'System' }}>
          Orders
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Main Content */}
      <View
        style={{ flex: 1 }}
        {...panResponder.panHandlers}
      >
        {/* Navigation Tabs */}
        <View className="px-4 py-3" style={{ backgroundColor: '#365441' }}>
          <View className="flex-row">
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setSelectedTab(tab)}
                className="flex-1 items-center justify-center py-3 rounded-3xl mx-1"
                style={{ 
                  backgroundColor: selectedTab === tab ? '#E8F3E0' : '#365441',
                  borderWidth: selectedTab === tab ? 0 : 1,
                  borderColor: '#2C4A34',
                  minHeight: 50,
                }}
              >
                <Text 
                  className="text-base font-semibold" 
                  style={{ 
                    color: selectedTab === tab ? '#2C4A34' : '#E8F3E0',
                    fontFamily: 'System',
                  }}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Orders List */}
        <FlatList
          data={filteredData}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="items-center mt-12">
              <Text className="text-base" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                No orders in this category
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

