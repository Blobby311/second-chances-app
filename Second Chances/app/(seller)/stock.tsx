import React, { useState, useMemo, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar, Image, Alert, PanResponder, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, Pencil, Trash2 } from 'lucide-react-native';
import '../../global.css';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// TODO: Replace with API call
const STOCK_DATA = {
  'To Ship': [
    {
      id: '1',
      name: 'Rescued Veggie Box',
      category: 'Vegetables',
      price: 'RM10',
      bestBefore: '01-09-25',
      status: 'Available',
      deliveryMethod: 'Grab',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRQEytqdym2soe7nH5Tqqe4X1GvyNbDbUs0A&s',
    },
    {
      id: '2',
      name: 'Sunrise Fruit Crate',
      category: 'Fruits',
      price: 'RM15',
      bestBefore: '02-09-25',
      status: 'Available',
      deliveryMethod: 'Doorstep',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSimGyJxyM2BpGcrcv9_b_lskXGFHA_TPoOw&s',
    },
    {
      id: '3',
      name: 'Organic Veg Rescue',
      category: 'Vegetables',
      price: 'RM12',
      bestBefore: '03-09-25',
      status: 'Available',
      deliveryMethod: 'Self Pick-Up',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0NTZmv6zIanNf621NF_dJQNoCb4eYQNAAzQ&s',
    },
  ],
  'Delivered': [
    {
      id: '4',
      name: 'Neighbor\'s Free Gift',
      category: 'Mix',
      price: 'RM0',
      bestBefore: '01-09-25',
      status: 'Delivered',
      deliveryMethod: 'Grab',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmAps3JJfGUb6r7bvZZL6zHjAzgxvMvD2Ijg&s',
    },
    {
      id: '5',
      name: 'Fresh Fruit Basket',
      category: 'Fruits',
      price: 'RM18',
      bestBefore: '02-09-25',
      status: 'Delivered',
      deliveryMethod: 'Doorstep',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRQEytqdym2soe7nH5Tqqe4X1GvyNbDbUs0A&s',
    },
  ],
  'Cancelled': [
    {
      id: '6',
      name: 'Mixed Veggie Box',
      category: 'Vegetables',
      price: 'RM10',
      bestBefore: '01-09-25',
      status: 'Cancelled',
      deliveryMethod: null,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSimGyJxyM2BpGcrcv9_b_lskXGFHA_TPoOw&s',
    },
  ],
};

const TABS = ['To Ship', 'Delivered', 'Cancelled'];

export default function StockScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('To Ship');
  const [stockData, setStockData] = useState<typeof STOCK_DATA>(STOCK_DATA);
  
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

  const filteredData = useMemo(() => {
    return stockData[selectedTab as keyof typeof stockData] || [];
  }, [selectedTab, stockData]);

  const handleDelete = (itemId: string, tab: string, itemName: string) => {
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
          onPress: () => {
            setStockData((prev) => {
              const newData = { ...prev };
              const tabKey = tab as keyof typeof newData;
              if (newData[tabKey]) {
                newData[tabKey] = newData[tabKey].filter((item) => item.id !== itemId) as any;
              }
              return newData;
            });
          },
        },
      ]
    );
  };

  type StockItem = {
    id: string;
    name: string;
    category: string;
    price: string;
    bestBefore: string;
    status: string;
    deliveryMethod: string | null;
    imageUrl: string;
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
        source={{ uri: item.imageUrl }}
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
            handleDelete(item.id, selectedTab, item.name);
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
      </View>

    </View>
  );
}

