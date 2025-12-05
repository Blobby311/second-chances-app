import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, ShoppingBag } from 'lucide-react-native';
import '../../global.css';

export default function OrdersScreen() {
  const router = useRouter();

  return (
    <View className="flex-1" style={{ backgroundColor: '#365441' }}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View 
        className="px-4"
        style={{ backgroundColor: '#2C4A34', paddingTop: 60, paddingBottom: 16 }}
      >
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Menu size={24} stroke="#ffffff" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold" style={{ color: '#ffffff', fontFamily: 'System' }}>
              My Orders
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="flex-1 items-center justify-center"
          style={{ paddingVertical: 32 }}
        >
          <View
            className="items-center justify-center rounded-3xl mb-6"
            style={{
              backgroundColor: '#E8F3E0',
              paddingVertical: 32,
              paddingHorizontal: 24,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: '#2C4A34',
              width: '100%',
            }}
          >
            <View
              className="items-center justify-center mb-4"
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: '#2C4A34',
                borderWidth: 2,
                borderColor: '#E8F3E0',
              }}
            >
              <ShoppingBag size={32} stroke="#E8F3E0" />
            </View>
            <Text
              className="text-lg font-semibold mb-2 text-center"
              style={{ color: '#2C4A34', fontFamily: 'System' }}
            >
              No orders yet
            </Text>
            <Text
              className="text-sm text-center"
              style={{ color: '#6b7280', fontFamily: 'System' }}
            >
              When you place an order, it will show up here so you can track its
              status easily.
            </Text>
          </View>

          <Text
            className="text-sm text-center"
            style={{ color: '#E8F3E0', fontFamily: 'System' }}
          >
            Browse the home page to discover rescued veggie and fruit boxes
            near you.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
