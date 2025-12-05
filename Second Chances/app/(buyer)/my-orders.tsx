import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, Star, Package } from 'lucide-react-native';
import '../../global.css';

// TODO: Replace with API call
const ORDERS_DATA = {
  'To Receive': [
    {
      id: '1',
      productName: 'Rescued Veggie Box',
      sellerId: 's1',
      sellerName: 'Uncle Roger',
      orderId: '#XM12345',
      deliveryMethod: 'Self Pick Up @ Farm',
      total: 'RM10',
      status: 'Ready for Pickup',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRQEytqdym2soe7nH5Tqqe4X1GvyNbDbUs0A&s',
      canRate: false,
    },
    {
      id: '2',
      productName: 'Sunrise Fruit Crate',
      sellerId: 's1',
      sellerName: 'Uncle Roger',
      orderId: '#YM67890',
      deliveryMethod: 'Doorstep Delivery',
      total: 'RM15',
      status: 'On the Way',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSimGyJxyM2BpGcrcv9_b_lskXGFHA_TPoOw&s',
      canRate: false,
    },
  ],
  'Completed': [
    {
      id: '3',
      productName: 'Organic Veg Rescue',
      sellerId: 's1',
      sellerName: 'Uncle Roger',
      orderId: '#ZN11223',
      deliveryMethod: 'Self Pick Up',
      total: 'RM12',
      status: 'Delivered',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0NTZmv6zIanNf621NF_dJQNoCb4eYQNAAzQ&s',
      canRate: true,
      rated: false,
    },
    {
      id: '4',
      productName: 'Neighbor\'s Free Gift',
      sellerId: 's1',
      sellerName: 'Uncle Roger',
      orderId: '#XM12346',
      deliveryMethod: 'Self Pick Up @ Farm',
      total: 'RM0',
      status: 'Completed',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmAps3JJfGUb6r7bvZZL6zHjAzgxvMvD2Ijg&s',
      canRate: true,
      rated: true,
    },
  ],
  'Cancelled': [
    {
      id: '5',
      productName: 'Mixed Veggie Box',
      sellerId: 's1',
      sellerName: 'Uncle Roger',
      orderId: '#YM67892',
      deliveryMethod: 'Doorstep Delivery',
      total: 'RM10',
      status: 'Cancelled',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSimGyJxyM2BpGcrcv9_b_lskXGFHA_TPoOw&s',
      canRate: false,
    },
  ],
};

const TABS = ['To Receive', 'Completed', 'Cancelled'];

export default function MyOrdersScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('To Receive');

  const filteredData = useMemo(() => {
    return ORDERS_DATA[selectedTab as keyof typeof ORDERS_DATA] || [];
  }, [selectedTab]);

  const handleRateSeller = (orderId: string, sellerId: string) => {
    router.push({
      pathname: '/rating/[orderId]',
      params: { orderId, sellerId },
    });
  };

  const handleContactSeller = (sellerId: string) => {
    router.push(`/chat/${sellerId}`);
  };

  const renderOrderItem = ({ item }: { item: typeof ORDERS_DATA['To Receive'][0] }) => (
    <TouchableOpacity
      onPress={() => router.push(`/(buyer)/order-detail/${item.id}`)}
      className="p-4 rounded-3xl mb-4"
      style={{ 
        backgroundColor: '#E8F3E0',
        borderWidth: 1,
        borderColor: '#2C4A34',
      }}
    >
      <View className="flex-row items-start mb-3">
        {/* Product Image */}
        <View 
          style={{ 
            width: 80, 
            height: 80, 
            borderRadius: 12,
            marginRight: 12,
            overflow: 'hidden',
            backgroundColor: '#ffffff',
          }}
        >
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>

        {/* Details */}
        <View className="flex-1">
          <Text className="text-base font-bold mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
            {item.productName}
          </Text>
          <Text className="text-sm mb-1" style={{ color: '#6b7280', fontFamily: 'System' }}>
            Seller: {item.sellerName}
          </Text>
          <Text className="text-sm mb-1" style={{ color: '#6b7280', fontFamily: 'System' }}>
            {item.orderId}
          </Text>
          <Text className="text-base font-bold" style={{ color: '#2C4A34', fontFamily: 'System' }}>
            {item.total === 'RM0' ? 'Community Gift' : item.total}
          </Text>
        </View>
      </View>

      {/* Delivery Method & Status */}
      <View className="mb-3">
        <Text className="text-sm mb-1" style={{ color: '#6b7280', fontFamily: 'System' }}>
          {item.deliveryMethod}
        </Text>
        <Text 
          className="text-sm font-semibold" 
          style={{ 
            color: selectedTab === 'Completed' ? '#16a34a' : selectedTab === 'Cancelled' ? '#C85E51' : '#2C4A34', 
            fontFamily: 'System' 
          }}
        >
          {item.status}
        </Text>
      </View>

      {/* Action Buttons */}
      <View className="flex-row" style={{ gap: 8 }}>
        <TouchableOpacity
          onPress={() => handleContactSeller(item.sellerId)}
          className="flex-1 py-3 rounded-2xl"
          style={{ backgroundColor: '#2C4A34' }}
        >
          <Text className="text-white text-sm font-semibold text-center" style={{ fontFamily: 'System' }}>
            Contact Seller
          </Text>
        </TouchableOpacity>
        
        {item.canRate && !item.rated && (
          <TouchableOpacity
            onPress={() => handleRateSeller(item.id, item.sellerId)}
            className="flex-1 py-3 rounded-2xl flex-row items-center justify-center"
            style={{ backgroundColor: '#C85E51' }}
          >
            <Star size={16} stroke="#ffffff" fill="#ffffff" />
            <Text className="text-white text-sm font-semibold ml-1" style={{ fontFamily: 'System' }}>
              Rate Seller
            </Text>
          </TouchableOpacity>
        )}

        {item.canRate && item.rated && (
          <View
            className="flex-1 py-3 rounded-2xl"
            style={{ backgroundColor: '#6b7280' }}
          >
            <Text className="text-white text-sm font-semibold text-center" style={{ fontFamily: 'System' }}>
              Rated
            </Text>
          </View>
        )}
      </View>
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
        <TouchableOpacity onPress={() => router.push('/(buyer)/menu')}>
          <Menu size={24} stroke="#ffffff" />
        </TouchableOpacity>
        <Text className="text-xl font-bold" style={{ color: '#ffffff', fontFamily: 'System' }}>
          My Orders
        </Text>
        <View style={{ width: 24 }} />
      </View>

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
            <Package size={48} stroke="#E8F3E0" />
            <Text className="text-base mt-4" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
              No orders in this category
            </Text>
          </View>
        }
      />
    </View>
  );
}

