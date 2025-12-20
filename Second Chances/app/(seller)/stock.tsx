import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar, Image, Alert, PanResponder, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Menu, Pencil, Trash2 } from 'lucide-react-native';
import '../../global.css';
import { API_URL } from '../../config/api';
import { getAuthToken } from '../../config/auth';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TABS = ['To Ship', 'Delivered', 'Cancelled'];

interface StockItem {
  id: string;
  name: string;
  category: string;
  price: string;
  bestBefore?: string;
  status: string;
  deliveryMethod: string | null;
  imageUrl: string;
}

export default function StockScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('To Ship');
  const [stockData, setStockData] = useState<{ [key: string]: StockItem[] }>({
    'To Ship': [],
    'Delivered': [],
    'Cancelled': [],
  });
  const [loading, setLoading] = useState(true);
  
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

  // Fetch stock from API
  const fetchStock = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        Alert.alert('Authentication Error', 'Please log in again.');
        router.replace('/login');
        return;
      }

      // Fetch all products for this seller
      const response = await fetch(`${API_URL}/api/seller/stock`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `Failed with status ${response.status}`);
      }

      const products = await response.json();

      // Map backend status to frontend tabs
      const mappedData: { [key: string]: StockItem[] } = {
        'To Ship': [],
        'Delivered': [],
        'Cancelled': [],
      };

      products.forEach((product: any) => {
        // Map backend status to frontend status
        let tabKey = 'To Ship';
        let displayStatus = 'Available';
        
        if (product.status === 'delivered') {
          tabKey = 'Delivered';
          displayStatus = 'Delivered';
        } else if (product.status === 'cancelled') {
          tabKey = 'Cancelled';
          displayStatus = 'Cancelled';
        } else {
          // to-ship or any other status goes to "To Ship"
          tabKey = 'To Ship';
          displayStatus = 'Available';
        }

        // Format image URL
        let imageUrl = product.imageUrl || '';
        if (imageUrl && !imageUrl.startsWith('http')) {
          // If it's a relative path, prepend the API URL
          imageUrl = `${API_URL}${imageUrl}`;
        }

        // Format price
        const priceStr = product.price === 0 ? 'Free' : `RM${product.price.toFixed(2)}`;

        // Format best before date if available
        let bestBefore = '';
        if (product.bestBefore) {
          const date = new Date(product.bestBefore);
          bestBefore = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getFullYear()).slice(-2)}`;
        }

        const stockItem: StockItem = {
          id: product._id || product.id,
          name: product.name,
          category: product.category || 'Mix',
          price: priceStr,
          bestBefore: bestBefore || undefined,
          status: displayStatus,
          deliveryMethod: product.deliveryMethod || null,
          imageUrl: imageUrl,
        };

        mappedData[tabKey].push(stockItem);
      });

      setStockData(mappedData);
    } catch (error: any) {
      console.error('Error fetching stock:', error);
      Alert.alert('Error', `Failed to load stock: ${error.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stock on mount and when screen is focused
  useEffect(() => {
    fetchStock();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchStock();
    }, [])
  );

  const filteredData = useMemo(() => {
    return stockData[selectedTab] || [];
  }, [selectedTab, stockData]);

  const handleDelete = async (itemId: string, itemName: string) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
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

              const response = await fetch(`${API_URL}/api/products/${itemId}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              });

              if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || 'Failed to delete product');
              }

              // Refresh stock list
              await fetchStock();
              Alert.alert('Success', 'Product deleted successfully.');
            } catch (error: any) {
              console.error('Error deleting product:', error);
              Alert.alert('Error', `Failed to delete product: ${error.message}`);
            }
          },
        },
      ]
    );
  };

  const renderStockItem = ({ item }: { item: StockItem }) => (
    <View 
      className="flex-row items-center p-4 rounded-3xl mb-4"
      style={{ 
        backgroundColor: '#E8F3E0',
        borderWidth: 1,
        borderColor: '#2C4A34',
      }}
    >
      {/* Product Image */}
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/60' }}
        style={{
          width: 60,
          height: 60,
          borderRadius: 12,
          marginRight: 12,
          backgroundColor: '#E8F3E0',
        }}
        resizeMode="cover"
        defaultSource={require('../../assets/logo.png')}
        onError={(error) => {
          console.log('Image failed to load for item:', item.name, 'URL:', item.imageUrl, 'Error:', error);
        }}
      />

      {/* Details */}
      <View className="flex-1">
        <Text className="text-base font-semibold mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
          {item.name}
        </Text>
        <Text className="text-sm mb-1" style={{ color: '#6b7280', fontFamily: 'System' }}>
          {item.category} • {item.price}
        </Text>
        {item.deliveryMethod && (
          <Text className="text-sm mb-1" style={{ color: '#6b7280', fontFamily: 'System' }}>
            {item.deliveryMethod}
          </Text>
        )}
        {item.bestBefore && (
          <Text className="text-sm mb-1" style={{ color: '#6b7280', fontFamily: 'System' }}>
            Best Before: {item.bestBefore}
          </Text>
        )}
        <Text className="text-sm font-semibold" style={{ color: item.status === 'Available' ? '#2C4A34' : item.status === 'Delivered' ? '#88B04B' : '#C85E51', fontFamily: 'System' }}>
          {item.status}
        </Text>
      </View>

      {/* Action Icons */}
      <View className="flex-col gap-3">
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: '/(seller)/edit-stock/[id]',
              params: { id: item.id },
            });
          }}
        >
          <Pencil size={20} stroke="#2C4A34" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleDelete(item.id, item.name);
          }}
        >
          <Trash2 size={20} stroke="#C85E51" />
        </TouchableOpacity>
      </View>
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
            <TouchableOpacity onPress={() => router.push('/(seller)/menu')}>
              <Menu size={24} stroke="#ffffff" />
            </TouchableOpacity>
            <Text className="text-xl font-bold" style={{ color: '#ffffff', fontFamily: 'System' }}>
              Stock List
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

      {/* Stock List */}
      <View
        style={{ flex: 1 }}
        {...panResponder.panHandlers}
      >
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#E8F3E0" />
          </View>
        ) : (
        <FlatList
          data={filteredData}
          renderItem={renderStockItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="items-center mt-12">
              <Text className="text-base" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                No items in this category
              </Text>
            </View>
          }
        />
        )}
      </View>

    </View>
  );
}
