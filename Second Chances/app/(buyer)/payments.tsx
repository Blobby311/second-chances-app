import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, CreditCard, Plus } from 'lucide-react-native';
import '../../global.css';

// TODO: Replace with API call
const PAYMENT_METHODS_DATA = [
  {
    id: '1',
    type: 'Card',
    last4: '4242',
    expiry: '12/25',
    isDefault: true,
  },
  {
    id: '2',
    type: 'Card',
    last4: '8888',
    expiry: '06/26',
    isDefault: false,
  },
];

export default function PaymentsScreen() {
  const router = useRouter();

  const renderPaymentMethod = ({ item }: { item: typeof PAYMENT_METHODS_DATA[0] }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 rounded-3xl mb-4"
      style={{ backgroundColor: '#E8F3E0', borderWidth: item.isDefault ? 2 : 0, borderColor: '#C85E51' }}
    >
      <View
        className="items-center justify-center mr-4"
        style={{ width: 50, height: 50, borderRadius: 12, backgroundColor: '#2C4A34' }}
      >
        <CreditCard size={24} stroke="#ffffff" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold" style={{ color: '#2C4A34', fontFamily: 'System' }}>
          {item.type} •••• {item.last4}
        </Text>
        <Text className="text-sm" style={{ color: '#6b7280', fontFamily: 'System' }}>
          Expires {item.expiry}
        </Text>
      </View>
      {item.isDefault && (
        <View className="px-3 py-1 rounded-full" style={{ backgroundColor: '#C85E51' }}>
          <Text className="text-xs font-semibold" style={{ color: '#ffffff', fontFamily: 'System' }}>
            Default
          </Text>
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
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Menu size={24} stroke="#ffffff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold" style={{ fontFamily: 'System' }}>
          Payment Methods
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View className="flex-1 px-4 pt-4">
        <FlatList
          data={PAYMENT_METHODS_DATA}
          keyExtractor={(item) => item.id}
          renderItem={renderPaymentMethod}
          contentContainerStyle={{ paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Add Payment Method Button */}
        <TouchableOpacity
          className="flex-row items-center justify-center py-4 rounded-3xl mt-4"
          style={{ backgroundColor: '#C85E51' }}
          onPress={() => {
            // TODO: Navigate to add payment method screen
            console.log('Add new payment method');
          }}
        >
          <Plus size={20} stroke="#ffffff" />
          <Text className="text-white text-base font-semibold ml-2" style={{ fontFamily: 'System' }}>
            Add Payment Method
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

