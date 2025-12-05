import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Image, FlatList, BackHandler, PanResponder, Dimensions } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Menu, Star, Package, AlertCircle } from 'lucide-react-native';
import '../../global.css';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// TODO: Replace with API call
const RECENT_SALES = [
  {
    id: '1',
    title: 'Mixed Fruit Box',
    price: 'RM 15.00',
    status: 'Paid',
    imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=200&q=60',
  },
  {
    id: '2',
    title: 'Vegetable Surprise Pack',
    price: 'RM 12.00',
    status: 'Paid',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=60',
  },
  {
    id: '3',
    title: 'Organic Veggie Mix',
    price: 'RM 18.00',
    status: 'Paid',
    imageUrl: 'https://images.unsplash.com/photo-1441126270775-739547c8680c?auto=format&fit=crop&w=200&q=60',
  },
  {
    id: '4',
    title: 'Fresh Produce Box',
    price: 'RM 20.00',
    status: 'Paid',
    imageUrl: 'https://images.unsplash.com/photo-1437751059337-ea72d4ac6690?auto=format&fit=crop&w=200&q=60',
  },
  {
    id: '5',
    title: 'Seasonal Fruit Basket',
    price: 'RM 16.00',
    status: 'Paid',
    imageUrl: 'https://images.unsplash.com/photo-1524594154908-edd206d5826c?auto=format&fit=crop&w=200&q=60',
  },
];

export default function DashboardScreen() {
  const router = useRouter();
  
  // PanResponder for swipe-to-open menu
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to rightward swipes from the left edge
        return gestureState.dx > 0 && evt.nativeEvent.pageX < 50;
      },
      onPanResponderRelease: (evt, gestureState) => {
        // If swiped more than 30% of screen width, navigate to menu
        if (gestureState.dx > SCREEN_WIDTH * 0.3) {
          router.push('/(seller)/menu');
        }
      },
    })
  ).current;

  // Prevent back navigation to login screen
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Prevent going back to login/role-selection
        return true; // Return true to prevent default back behavior
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => backHandler.remove();
    }, [])
  );


  const renderSaleItem = ({ item }: { item: typeof RECENT_SALES[0] }) => (
    <TouchableOpacity
      className="flex-row items-center mb-3"
      onPress={() => {
        router.push({
          pathname: '/(seller)/order-detail/[id]',
          params: { id: item.id },
        });
      }}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={{ width: 60, height: 60, borderRadius: 12, marginRight: 12 }}
      />
      <View className="flex-1">
        <Text className="text-base font-semibold mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
          {item.title}
        </Text>
        <Text className="text-base mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
          {item.price}
        </Text>
        <Text className="text-sm" style={{ color: '#6b7280', fontFamily: 'System' }}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Simple line graph component
  const SimpleGraph = () => {
    const data = [30, 45, 35, 50, 40, 55, 45]; // Sample data points
    const maxValue = Math.max(...data);
    const graphHeight = 50;
    const graphWidth = 100;
    const barWidth = graphWidth / data.length - 2;

    return (
      <View style={{ width: graphWidth, height: graphHeight, justifyContent: 'flex-end' }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: graphHeight, gap: 2 }}>
          {data.map((value, index) => {
            const barHeight = (value / maxValue) * graphHeight;
            return (
              <View
                key={index}
                style={{
                  width: barWidth,
                  height: barHeight,
                  backgroundColor: '#2C4A34',
                  borderRadius: 2,
                }}
              />
            );
          })}
        </View>
    </View>
  );
  };

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
          Dashboard
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View
        style={{ flex: 1 }}
        {...panResponder.panHandlers}
      >
      <ScrollView
        className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Total Earnings */}
        <View
          style={{
            backgroundColor: '#E8F3E0',
            borderRadius: 24,
            padding: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#2C4A34',
          }}
        >
          <Text className="text-lg font-bold mb-2" style={{ color: '#2C4A34', fontFamily: 'System' }}>
            Total Earnings
          </Text>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-4xl font-bold" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                RM 450.00
              </Text>
            </View>
            <View
              style={{
                width: 100,
                height: 60,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SimpleGraph />
            </View>
          </View>
        </View>

        {/* Section 2: Statistics Cards - Split into two separate cards */}
        <View className="flex-row" style={{ gap: 12, marginBottom: 16 }}>
          {/* Active Listings Card */}
            <View
              style={{
                flex: 1,
                backgroundColor: '#E8F3E0',
              borderRadius: 24,
              padding: 20,
              borderWidth: 1,
              borderColor: '#2C4A34',
              alignItems: 'center',
              justifyContent: 'center',
              }}
            >
            <Text className="text-lg font-bold mb-2" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                Active Listings
              </Text>
            <Text className="text-3xl font-bold mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                3
              </Text>
            <Text className="text-xs" style={{ color: '#6b7280', fontFamily: 'System' }}>
              listings
            </Text>
            </View>

          {/* Trust Score Card */}
            <View
              style={{
                flex: 1,
                backgroundColor: '#E8F3E0',
              borderRadius: 24,
              padding: 20,
              borderWidth: 1,
              borderColor: '#2C4A34',
              alignItems: 'center',
              justifyContent: 'center',
              }}
            >
            <Text className="text-lg font-bold mb-2" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                Trust Score
              </Text>
            <Text className="text-3xl font-bold mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                  4.9
                </Text>
            <Text className="text-xs" style={{ color: '#6b7280', fontFamily: 'System' }}>
              stars
                </Text>
                </View>
              </View>

        {/* Quick Stats Card */}
        <View
          style={{
            backgroundColor: '#E8F3E0',
            borderRadius: 24,
            padding: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#2C4A34',
          }}
        >
          <Text className="text-lg font-bold mb-4" style={{ color: '#2C4A34', fontFamily: 'System' }}>
            Quick Stats
          </Text>
          <View className="flex-row flex-wrap" style={{ gap: 16 }}>
            <View style={{ flex: 1, minWidth: '45%', alignItems: 'center' }}>
              <Text className="text-3xl font-bold mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                24
              </Text>
              <Text className="text-sm" style={{ color: '#6b7280', fontFamily: 'System' }}>
                Total Orders
              </Text>
            </View>
            <View style={{ flex: 1, minWidth: '45%', alignItems: 'center' }}>
              <Text className="text-3xl font-bold mb-1" style={{ color: '#C85E51', fontFamily: 'System' }}>
                3
              </Text>
              <Text className="text-sm" style={{ color: '#6b7280', fontFamily: 'System' }}>
                Pending
              </Text>
            </View>
            <View style={{ flex: 1, minWidth: '45%', alignItems: 'center' }}>
              <Text className="text-3xl font-bold mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                21
              </Text>
              <Text className="text-sm" style={{ color: '#6b7280', fontFamily: 'System' }}>
                Completed
              </Text>
            </View>
            <View style={{ flex: 1, minWidth: '45%', alignItems: 'center' }}>
              <Text className="text-3xl font-bold mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                48
              </Text>
              <Text className="text-sm" style={{ color: '#6b7280', fontFamily: 'System' }}>
                Items Sold
              </Text>
            </View>
          </View>
        </View>

        {/* Alert Card */}
        <View
          style={{
            backgroundColor: '#E8F3E0',
            borderRadius: 24,
            padding: 20,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#2C4A34',
          }}
        >
          <Text className="text-lg font-bold mb-4" style={{ color: '#2C4A34', fontFamily: 'System' }}>
            Alerts
          </Text>
          <View style={{ gap: 12 }}>
            <View
              className="flex-row items-center px-4 py-3 rounded-2xl"
              style={{
                backgroundColor: '#2C4A34',
                borderWidth: 1,
                borderColor: '#2C4A34',
              }}
            >
              <Package size={20} stroke="#E8F3E0" style={{ marginRight: 12 }} />
              <Text className="text-base flex-1" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                2 items running low on stock
              </Text>
            </View>
            <View
              className="flex-row items-center px-4 py-3 rounded-2xl"
              style={{
                backgroundColor: '#2C4A34',
                borderWidth: 1,
                borderColor: '#2C4A34',
              }}
            >
              <AlertCircle size={20} stroke="#E8F3E0" style={{ marginRight: 12 }} />
              <Text className="text-base flex-1" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                3 orders pending shipment
              </Text>
            </View>
          </View>
        </View>

        {/* Section 3: Recent Sales */}
        <View
          style={{
            backgroundColor: '#E8F3E0',
            borderRadius: 24,
            padding: 20,
            borderWidth: 1,
            borderColor: '#2C4A34',
          }}
        >
          <Text className="text-lg font-bold mb-4" style={{ color: '#2C4A34', fontFamily: 'System' }}>
            Recent Sales
          </Text>
          <FlatList
            data={RECENT_SALES}
            keyExtractor={(item) => item.id}
            renderItem={renderSaleItem}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
      </View>
    </View>
  );
}
