import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, HelpCircle, ChevronRight } from 'lucide-react-native';
import '../../global.css';

// TODO: Replace with API call
const HELP_TOPICS = [
  { id: '1', title: 'How to place an order', category: 'Orders' },
  { id: '2', title: 'Payment methods', category: 'Payment' },
  { id: '3', title: 'Delivery information', category: 'Delivery' },
  { id: '4', title: 'Returns and refunds', category: 'Returns' },
  { id: '5', title: 'Account settings', category: 'Account' },
  { id: '6', title: 'Contact support', category: 'Support' },
];

export default function HelpScreen() {
  const router = useRouter();

  const renderHelpTopic = ({ item }: { item: typeof HELP_TOPICS[0] }) => (
    <TouchableOpacity
      className="flex-row items-center justify-between p-4 rounded-3xl mb-3"
      style={{ backgroundColor: '#E8F3E0' }}
      onPress={() => {
        // TODO: Navigate to help detail screen
        console.log(`Open help topic: ${item.id}`);
      }}
    >
      <View className="flex-row items-center flex-1">
        <HelpCircle size={24} stroke="#2C4A34" style={{ marginRight: 12 }} />
        <View className="flex-1">
          <Text className="text-base font-semibold" style={{ color: '#2C4A34', fontFamily: 'System' }}>
            {item.title}
          </Text>
          <Text className="text-xs mt-1" style={{ color: '#6b7280', fontFamily: 'System' }}>
            {item.category}
          </Text>
        </View>
      </View>
      <ChevronRight size={20} stroke="#2C4A34" />
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
          Help & Support
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View className="flex-1 px-4 pt-4">
        <FlatList
          data={HELP_TOPICS}
          keyExtractor={(item) => item.id}
          renderItem={renderHelpTopic}
          contentContainerStyle={{ paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Contact Support Button */}
        <TouchableOpacity
          className="flex-row items-center justify-center py-4 rounded-3xl mt-4"
          style={{ backgroundColor: '#C85E51' }}
          onPress={() => {
            // TODO: Open contact support
            console.log('Contact support');
          }}
        >
          <Text className="text-white text-base font-semibold" style={{ fontFamily: 'System' }}>
            Contact Support
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

