import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import '../../global.css';

// TODO: Replace with API call
const INITIAL_USER_DATA = {
  name: 'Uncle Roger',
  fullName: 'Nigel Ng',
  email: 'uncleroger@farm.com',
  phone: '+60123456789',
  avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa3du6j726GP7-rDxHda8-FYopWptm3LsTWA&s',
};

export default function EditProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [name, setName] = useState(INITIAL_USER_DATA.name);
  const [fullName, setFullName] = useState(INITIAL_USER_DATA.fullName);
  const [email, setEmail] = useState(INITIAL_USER_DATA.email);
  const [phone, setPhone] = useState(INITIAL_USER_DATA.phone);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.name) setName(params.name as string);
    if (params.fullName) setFullName(params.fullName as string);
    if (params.email) setEmail(params.email as string);
    if (params.phone) setPhone(params.phone as string);
  }, [params]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Call API to save profile changes
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#365441' }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View
        className="flex-row items-center px-4"
        style={{ backgroundColor: '#2C4A34', paddingTop: 60, paddingBottom: 16 }}
      >
        <TouchableOpacity onPress={handleCancel} className="mr-3">
          <ArrowLeft size={24} stroke="#ffffff" />
        </TouchableOpacity>
        <Text className="text-xl font-bold flex-1 text-center" style={{ color: '#ffffff', fontFamily: 'System' }}>
          Edit Profile
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View className="flex-1 px-4 pt-8">
        {/* Name Input */}
        <View className="mb-4">
          <Text className="text-sm font-semibold mb-2" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            Name
          </Text>
          <TextInput
            className="px-4 py-3 rounded-2xl"
            style={{ backgroundColor: '#E8F3E0', color: '#2C4A34', fontFamily: 'System' }}
            value={name}
            onChangeText={setName}
            placeholder="Enter your username"
            placeholderTextColor="#6b7280"
          />
        </View>

        {/* Email Input - Read Only */}
        <View className="mb-4">
          <Text className="text-sm font-semibold mb-2" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            Email (cannot be changed)
          </Text>
          <TextInput
            className="px-4 py-3 rounded-2xl"
            style={{ backgroundColor: '#E8F3E0', color: '#6b7280', fontFamily: 'System' }}
            value={email}
            editable={false}
            placeholder="Enter your email"
            placeholderTextColor="#6b7280"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Phone Input */}
        <View className="mb-6">
          <Text className="text-sm font-semibold mb-2" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            Phone
          </Text>
          <TextInput
            className="px-4 py-3 rounded-2xl"
            style={{ backgroundColor: '#E8F3E0', color: '#2C4A34', fontFamily: 'System' }}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            placeholderTextColor="#6b7280"
            keyboardType="phone-pad"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          className="py-4 rounded-3xl mb-4"
          style={{ backgroundColor: '#C85E51', opacity: loading ? 0.7 : 1 }}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-base font-semibold text-center" style={{ color: '#ffffff', fontFamily: 'System' }}>
              Save
            </Text>
          )}
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          onPress={handleCancel}
          className="py-4 rounded-3xl"
          style={{ backgroundColor: '#E8F3E0' }}
        >
          <Text className="text-base font-semibold text-center" style={{ color: '#2C4A34', fontFamily: 'System' }}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

