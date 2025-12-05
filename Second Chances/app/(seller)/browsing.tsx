import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, User } from 'lucide-react-native';
import '../../global.css';

// TODO: Replace with API call
const PRODUCTS_DATA = [
  {
    id: '1',
    title: 'Daily Veggie Haul',
    description: 'Fresh, rescued produce!',
    pickup: 'Pickup Today',
    price: 'RM10',
  },
  {
    id: '2',
    title: 'Mystery Fruit Basket',
    description: 'Surprise selection!',
    pickup: 'Pickup Today',
    price: 'RM15',
  },
  {
    id: '3',
    title: 'Daily Veggie Haul',
    description: 'Fresh, rescued produce!',
    pickup: 'Pickup Today',
    price: 'RM10',
  },
  {
    id: '4',
    title: 'Mystery Fruit Basket',
    description: 'Surprise selection!',
    pickup: 'Pickup Today',
    price: 'RM15',
  },
];

const FILTER_TABS = ['All', 'Vegetables', 'New Arrivals', 'Favorites'];

export default function BrowsingScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('All');

  const renderProductCard = ({ item }: { item: typeof PRODUCTS_DATA[0] }) => (
    <View className="flex-1 m-2 rounded-3xl" style={{ backgroundColor: '#E8F3E0' }}>
      {/* Product Illustration */}
      <View className="items-center p-4" style={{ position: 'relative' }}>
        {/* Brown Bag */}
        <View 
          style={{ 
            width: 120, 
            height: 140, 
            backgroundColor: '#d4a574', 
            borderWidth: 3,
            borderColor: '#8b6f47',
            borderRadius: 12,
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
            position: 'relative',
            paddingTop: 12,
            alignItems: 'center',
          }}
        >
          {/* Question Mark Badge */}
          <View 
            style={{ 
              position: 'absolute', 
              top: 20, 
              left: '50%', 
              transform: [{ translateX: -20 }],
              width: 40, 
              height: 40, 
              borderRadius: 20,
              backgroundColor: '#ef4444',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: '#ffffff',
            }}
          >
            <Text style={{ fontSize: 24, color: '#ffffff', fontFamily: 'System', fontWeight: 'bold' }}>?</Text>
          </View>

          {/* Produce items inside bag */}
          <View className="absolute bottom-4 left-0 right-0 flex-row flex-wrap justify-center">
            <View style={{ width: 16, height: 20, backgroundColor: '#f97316', borderRadius: 8, marginHorizontal: 2, marginBottom: 2 }} />
            <View style={{ width: 14, height: 14, backgroundColor: '#16a34a', borderRadius: 7, marginHorizontal: 2, marginBottom: 2 }} />
            <View style={{ width: 14, height: 14, backgroundColor: '#ef4444', borderRadius: 7, marginHorizontal: 2, marginBottom: 2 }} />
            <View style={{ width: 14, height: 14, backgroundColor: '#a855f7', borderRadius: 7, marginHorizontal: 2, marginBottom: 2 }} />
          </View>
        </View>
      </View>

      {/* Product Info */}
      <View className="px-4 pb-4">
        <Text className="text-lg font-bold mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
          {item.title}
        </Text>
        <Text className="text-sm mb-1" style={{ color: '#6b7280', fontFamily: 'System' }}>
          {item.description}
        </Text>
        <Text className="text-xs mb-3" style={{ color: '#6b7280', fontFamily: 'System' }}>
          {item.pickup}
        </Text>

        {/* Price and Button Row */}
        <View className="flex-row items-center justify-between">
          <View 
            className="px-3 py-1 rounded-full flex-row items-center"
            style={{ backgroundColor: '#2C4A34' }}
          >
            <Text className="text-white text-sm font-semibold mr-1" style={{ fontFamily: 'System' }}>
              {item.price}
            </Text>
            <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#ffffff' }} />
          </View>

          <TouchableOpacity 
            className="px-4 py-2 rounded-3xl"
            style={{ backgroundColor: '#C85E51' }}
          >
            <Text className="text-white text-sm font-semibold" style={{ fontFamily: 'System' }}>
              Grab Now!
            </Text>
          </TouchableOpacity>
        </View>
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
            <View className="flex-row items-center flex-1">
              <TouchableOpacity onPress={() => router.push('/(seller)/dashboard')} className="mr-3">
                <Menu size={24} stroke="#ffffff" />
              </TouchableOpacity>
              <View className="flex-row items-center">
                <Image 
                  source={require('../../assets/logo.png')} 
                  style={{ 
                    width: 24, 
                    height: 24,
                    marginRight: 8,
                  }}
                  resizeMode="contain"
                />
                <Text className="text-white text-xl font-bold" style={{ fontFamily: 'System' }}>
                  Second Chances
                </Text>
              </View>
            </View>

            <TouchableOpacity>
              <User size={24} stroke="#ffffff" />
            </TouchableOpacity>
          </View>

      {/* Filter Tabs */}
      <View className="px-4 py-3" style={{ backgroundColor: '#365441' }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTER_TABS}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedTab(item)}
              className="px-4 py-2 rounded-full mr-3"
              style={{ 
                backgroundColor: selectedTab === item ? '#2C4A34' : '#E8F3E0',
                borderWidth: selectedTab === item ? 0 : 1,
                borderColor: '#2C4A34',
              }}
            >
              <Text 
                className="text-sm font-semibold" 
                style={{ 
                  color: selectedTab === item ? '#ffffff' : '#2C4A34',
                  fontFamily: 'System',
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Product List */}
      <FlatList
        data={PRODUCTS_DATA}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 8, paddingBottom: 20, backgroundColor: '#365441' }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
    </View>
  );
}

