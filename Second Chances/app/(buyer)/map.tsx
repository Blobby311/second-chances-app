import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, MapPin } from 'lucide-react-native';
import '../../global.css';

export default function MapScreen() {
  const router = useRouter();

  return (
    <View className="flex-1" style={{ backgroundColor: '#365441' }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4"
        style={{ backgroundColor: '#2C4A34', paddingTop: 60, paddingBottom: 16 }}
      >
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Menu size={24} stroke="#ffffff" />
        </TouchableOpacity>
        <Text className="text-xl font-bold flex-1 text-center" style={{ color: '#ffffff', fontFamily: 'System' }}>
          Map
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Map Placeholder */}
      <View className="flex-1 items-center justify-center">
        <MapPin size={64} stroke="#E8F3E0" />
        <Text className="text-lg font-semibold mt-4" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
          Map View Coming Soon
        </Text>
        <Text className="text-sm mt-2 px-8 text-center" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
          {/* TODO: Integrate map component */}
          This feature will show nearby sellers and products on a map.
        </Text>
      </View>
    </View>
  );
}

