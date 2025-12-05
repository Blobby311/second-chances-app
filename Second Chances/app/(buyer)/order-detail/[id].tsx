import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ShoppingBag, MapPin } from 'lucide-react-native';
import '../../../global.css';

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

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
            <ArrowLeft size={24} stroke="#ffffff" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold" style={{ color: '#ffffff', fontFamily: 'System' }}>
              Order Details
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
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
          <View className="flex-row items-center mb-4">
            <View
              className="items-center justify-center mr-3"
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: '#2C4A34',
              }}
            >
              <ShoppingBag size={22} stroke="#E8F3E0" />
            </View>
            <View className="flex-1">
              <Text
                className="text-lg font-bold"
                style={{ color: '#2C4A34', fontFamily: 'System' }}
              >
                Blindbox Order
              </Text>
              <Text
                className="text-xs mt-1"
                style={{ color: '#6b7280', fontFamily: 'System' }}
              >
                Order ID: {id}
              </Text>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: '#2C4A34', opacity: 0.1, marginBottom: 12 }} />

          <View style={{ marginBottom: 8 }}>
            <Text
              className="text-sm font-semibold mb-1"
              style={{ color: '#2C4A34', fontFamily: 'System' }}
            >
              Status
            </Text>
            <Text
              className="text-sm"
              style={{ color: '#C85E51', fontFamily: 'System' }}
            >
              Preparing your rescued box
            </Text>
          </View>

          <View style={{ marginTop: 12 }}>
            <Text
              className="text-sm font-semibold mb-1"
              style={{ color: '#2C4A34', fontFamily: 'System' }}
            >
              Pickup / delivery
            </Text>
            <View className="flex-row items-center">
              <MapPin size={14} stroke="#6b7280" />
              <Text
                className="text-xs ml-1"
                style={{ color: '#6b7280', fontFamily: 'System' }}
              >
                Details will appear here once confirmed.
              </Text>
            </View>
          </View>
        </View>

        <Text
          className="text-sm"
          style={{ color: '#E8F3E0', fontFamily: 'System' }}
        >
          This is a placeholder view for buyer order details. When the backend
          is connected, item breakdown, payment summary and tracking info can be
          rendered inside the card above.
        </Text>
      </ScrollView>
    </View>
  );
}
