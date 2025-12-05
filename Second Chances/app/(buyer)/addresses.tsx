import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, MapPin, Plus } from 'lucide-react-native';
import '../../global.css';

// TODO: Replace with API call
const ADDRESSES_DATA = [
  {
    id: '1',
    label: 'Home',
    address: '123 Main Street, Kuala Lumpur, 50000',
    isDefault: true,
  },
  {
    id: '2',
    label: 'Office',
    address: '456 Business Park, Petaling Jaya, 47800',
    isDefault: false,
  },
];

export default function AddressesScreen() {
  const router = useRouter();

  const renderAddress = ({ item }: { item: typeof ADDRESSES_DATA[0] }) => (
    <TouchableOpacity
      className="p-4 rounded-3xl mb-4"
      style={{ backgroundColor: '#E8F3E0', borderWidth: item.isDefault ? 2 : 0, borderColor: '#C85E51' }}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-base font-semibold" style={{ color: '#2C4A34', fontFamily: 'System' }}>
          {item.label}
        </Text>
        {item.isDefault && (
          <View className="px-3 py-1 rounded-full" style={{ backgroundColor: '#C85E51' }}>
            <Text className="text-xs font-semibold" style={{ color: '#ffffff', fontFamily: 'System' }}>
              Default
            </Text>
          </View>
        )}
      </View>
      <View className="flex-row items-start">
        <MapPin size={16} stroke="#6b7280" style={{ marginTop: 2, marginRight: 8 }} />
        <Text className="text-sm flex-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
          {item.address}
        </Text>
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
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Menu size={24} stroke="#ffffff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold" style={{ fontFamily: 'System' }}>
          Addresses
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View className="flex-1 px-4 pt-4">
        <FlatList
          data={ADDRESSES_DATA}
          keyExtractor={(item) => item.id}
          renderItem={renderAddress}
          contentContainerStyle={{ paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Add Address Button */}
        <TouchableOpacity
          className="flex-row items-center justify-center py-4 rounded-3xl mt-4"
          style={{ backgroundColor: '#C85E51' }}
          onPress={() => {
            // TODO: Navigate to add address screen
            console.log('Add new address');
          }}
        >
          <Plus size={20} stroke="#ffffff" />
          <Text className="text-white text-base font-semibold ml-2" style={{ fontFamily: 'System' }}>
            Add New Address
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

