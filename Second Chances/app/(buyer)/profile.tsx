import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, User, MapPin, Heart, Star } from 'lucide-react-native';
import '../../global.css';

// TODO: Replace with API call
const MOCK_PROFILE = {
  name: 'ChuaWasHere',
  email: 'ahmad@example.com',
  location: 'Kuala Lumpur, Malaysia',
  rescuedBoxes: 8,
  favoritesCount: 3,
  rating: 4.9,
  avatar:
    'https://i.pinimg.com/236x/fd/88/22/fd88222b6ea609087ebced0e544d1eb1.jpg',
};

export default function ProfileScreen() {
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
              Profile
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View
          className="items-center mb-6 mt-4"
          style={{
            backgroundColor: '#E8F3E0',
            borderRadius: 24,
            paddingVertical: 24,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: '#2C4A34',
          }}
        >
          {MOCK_PROFILE.avatar ? (
            <Image
              source={{ uri: MOCK_PROFILE.avatar }}
              style={{
                width: 110,
                height: 110,
                borderRadius: 55,
                marginBottom: 16,
                borderWidth: 3,
                borderColor: '#2C4A34',
              }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: 110,
                height: 110,
                borderRadius: 55,
                backgroundColor: '#E8F3E0',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                borderWidth: 3,
                borderColor: '#2C4A34',
              }}
            >
              <User size={56} stroke="#2C4A34" />
            </View>
          )}

          <Text
            className="text-2xl font-bold mb-1"
            style={{ color: '#2C4A34', fontFamily: 'System' }}
          >
            {MOCK_PROFILE.name}
          </Text>
          <Text
            className="text-sm mb-2"
            style={{ color: '#6b7280', fontFamily: 'System' }}
          >
            {MOCK_PROFILE.email}
          </Text>

          <View className="flex-row items-center mb-4">
            <MapPin size={14} stroke="#6b7280" />
            <Text
              className="text-xs ml-1"
              style={{ color: '#6b7280', fontFamily: 'System' }}
            >
              {MOCK_PROFILE.location}
            </Text>
          </View>

          <TouchableOpacity
            className="px-5 py-3 rounded-3xl"
            style={{ backgroundColor: '#C85E51' }}
            onPress={() =>
              router.push({
                pathname: '/(buyer)/edit-profile',
                params: {
                  name: MOCK_PROFILE.name,
                  email: MOCK_PROFILE.email,
                },
              })
            }
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: '#ffffff', fontFamily: 'System' }}
            >
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View
          className="flex-row mb-6"
          style={{ gap: 12 }}
        >
          <View
            className="flex-1 items-center justify-center"
            style={{
              backgroundColor: '#E8F3E0',
              borderRadius: 24,
              paddingVertical: 16,
              borderWidth: 1,
              borderColor: '#2C4A34',
            }}
          >
            <Text
              className="text-2xl font-bold mb-1"
              style={{ color: '#2C4A34', fontFamily: 'System' }}
            >
              {MOCK_PROFILE.rescuedBoxes}
            </Text>
            <Text
              className="text-xs"
              style={{ color: '#6b7280', fontFamily: 'System' }}
            >
              Boxes rescued
            </Text>
          </View>

          <View
            className="flex-1 items-center justify-center"
            style={{
              backgroundColor: '#E8F3E0',
              borderRadius: 24,
              paddingVertical: 16,
              borderWidth: 1,
              borderColor: '#2C4A34',
            }}
          >
            <View className="flex-row items-center mb-1">
              <Heart size={16} stroke="#C85E51" fill="none" />
              <Text
                className="text-2xl font-bold ml-1"
                style={{ color: '#2C4A34', fontFamily: 'System' }}
              >
                {MOCK_PROFILE.favoritesCount}
              </Text>
            </View>
            <Text
              className="text-xs"
              style={{ color: '#6b7280', fontFamily: 'System' }}
            >
              Favorites
            </Text>
          </View>

          <View
            className="flex-1 items-center justify-center"
            style={{
              backgroundColor: '#E8F3E0',
              borderRadius: 24,
              paddingVertical: 16,
              borderWidth: 1,
              borderColor: '#2C4A34',
            }}
          >
            <View className="flex-row items-center mb-1">
              <Star size={16} stroke="#C85E51" fill="#C85E51" />
              <Text
                className="text-2xl font-bold ml-1"
                style={{ color: '#2C4A34', fontFamily: 'System' }}
              >
                {MOCK_PROFILE.rating}
              </Text>
            </View>
            <Text
              className="text-xs"
              style={{ color: '#6b7280', fontFamily: 'System' }}
            >
              Avg. rating
            </Text>
          </View>
        </View>

        {/* Info Text */}
        <Text
          className="text-sm"
          style={{ color: '#E8F3E0', fontFamily: 'System' }}
        >
          This is your buyer profile overview. Details like addresses, payment
          methods and rewards can be managed from their respective pages in the
          menu.
        </Text>
      </ScrollView>
    </View>
  );
}
