import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, Heart, MapPin, GraduationCap, Star, Bell, Settings, MessageCircle, Package } from 'lucide-react-native';
import '../../global.css';

export default function MenuScreen() {
  const router = useRouter();

  const menuItems = [
    { id: '1', title: 'My Orders', icon: Package, route: '/(buyer)/my-orders' },
    { id: '2', title: 'Favorites', icon: Heart, route: '/(buyer)/favorites' },
    { id: '3', title: 'Map', icon: MapPin, route: '/(buyer)/map' },
    { id: '4', title: 'Learn', icon: GraduationCap, route: '/(buyer)/learn' },
    { id: '5', title: 'Rewards', icon: Star, route: '/(buyer)/rewards' },
    { id: '6', title: 'Notifications', icon: Bell, route: '/(buyer)/notifications' },
  ];

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
        <Text
          className="text-white text-lg font-semibold flex-1 text-center"
          style={{ fontFamily: 'System' }}
        >
          The Gatherer
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Main Navigation Buttons */}
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingTop: 24, flexGrow: 1 }}
      >
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => router.push(item.route)}
              className="flex-row items-center px-6 rounded-3xl mb-4"
              style={{ backgroundColor: '#E8F3E0', minHeight: 80, flex: 1, borderWidth: 1, borderColor: '#2C4A34' }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: '#2C4A34',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 16,
                }}
              >
                <IconComponent size={28} stroke="#E8F3E0" />
              </View>
              <Text className="text-xl font-semibold flex-1" style={{ fontFamily: 'System', color: '#365441' }}>
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Bottom Navigation Icons */}
      <View 
        className="flex-row justify-around items-center px-8 py-6"
        style={{ backgroundColor: '#2C4A34' }}
      >
        <TouchableOpacity
          onPress={() => {
            router.push('/(buyer)/settings');
          }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            borderWidth: 2,
            borderColor: '#ffffff',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Settings size={24} stroke="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: '/chat',
              params: { role: 'buyer' },
            });
          }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            borderWidth: 2,
            borderColor: '#ffffff',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MessageCircle size={24} stroke="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

