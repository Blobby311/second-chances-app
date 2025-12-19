import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Menu, Star, Package } from 'lucide-react-native';
import '../../global.css';
import { API_URL } from '../../config/api';
import { getAuthToken } from '../../config/auth';

const TABS = ['To Receive', 'Completed', 'Cancelled'];

interface OrderItem {
  id: string;
  productName: string;
  sellerId: string;
  sellerName: string;
  orderId: string;
  deliveryMethod: string;
  total: string;
  status: string;
  imageUrl: string;
  canRate: boolean;
  rated?: boolean;
}

export default function MyOrdersScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('To Receive');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      // Map frontend tab to backend status
      let status: string | undefined;
      if (selectedTab === 'To Receive') {
        status = 'to-receive';
      } else if (selectedTab === 'Completed') {
        status = 'completed';
      } else if (selectedTab === 'Cancelled') {
        status = 'cancelled';
      }

      const url = status 
        ? `${API_URL}/api/orders/buyer/orders?status=${status}`
        : `${API_URL}/api/orders/buyer/orders`;

      console.log('Fetching orders from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Response status:', response.status, response.statusText);

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = 'Failed to fetch orders';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
          console.error('Error response:', errorData);
        } catch (e) {
          // Response might not be JSON
          const text = await response.text();
          console.error('Error response (text):', text);
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Orders fetched successfully:', data.length, 'orders');

      // Transform backend data to frontend format
      const formattedOrders: OrderItem[] = data.map((order: any) => {
        const product = order.product || {};
        const seller = order.seller || {};
        
        // Map backend status to display status
        let displayStatus = order.status;
        if (order.status === 'ready-for-pickup') displayStatus = 'Ready for Pickup';
        else if (order.status === 'on-the-way') displayStatus = 'On the Way';
        else if (order.status === 'delivered') displayStatus = 'Delivered';
        else if (order.status === 'pending') displayStatus = 'Pending';
        
        return {
          id: order._id || order.id,
          productName: product.name || 'Unknown Product',
          sellerId: order.seller?._id || order.seller || '',
          sellerName: seller.name || 'Unknown Seller',
          orderId: order.orderId || '#UNKNOWN',
          deliveryMethod: order.deliveryMethod || 'Not specified',
          total: order.total === 0 ? 'RM0' : `RM${order.total.toFixed(2)}`,
          status: displayStatus,
          imageUrl: product.imageUrl || 'https://via.placeholder.com/400',
          canRate: order.status === 'completed' || order.status === 'delivered',
          rated: false, // TODO: Check if order has been rated
        };
      });

      setOrders(formattedOrders);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      const errorMessage = error?.message || 'Failed to load orders';
      
      // Show more specific error messages
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        Alert.alert('Authentication Error', 'Please log in again.');
      } else if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
        Alert.alert('Access Denied', 'You need buyer role to view orders.');
      } else if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
        Alert.alert('Connection Error', 'Unable to reach server. Please check your internet connection.');
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders when tab changes
  useEffect(() => {
    fetchOrders();
  }, [selectedTab]);

  // Refetch when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchOrders();
    }, [selectedTab])
  );

  const filteredData = useMemo(() => {
    return orders;
  }, [orders]);

  const handleRateSeller = (orderId: string, sellerId: string) => {
    router.push({
      pathname: '/rating/[orderId]',
      params: { orderId, sellerId },
    });
  };

  const handleContactSeller = (sellerId: string) => {
    router.push(`/chat/${sellerId}`);
  };

  const renderOrderItem = ({ item }: { item: OrderItem }) => (
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
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#E8F3E0" />
        </View>
      ) : (
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
      )}
    </View>
  );
}

