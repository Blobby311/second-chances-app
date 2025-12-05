import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, Image, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import '../../global.css';

// TODO: Replace with API call
const INITIAL_USER_DATA = {
  name: 'Ahmad',
  email: 'ahmad@example.com',
  phone: '+60123456789',
  avatar: 'https://i.pinimg.com/236x/fd/88/22/fd88222b6ea609087ebced0e544d1eb1.jpg',
};

export default function EditProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [name, setName] = useState(INITIAL_USER_DATA.name);
  const [email, setEmail] = useState(INITIAL_USER_DATA.email);
  const [phone, setPhone] = useState(INITIAL_USER_DATA.phone);

  useEffect(() => {
    if (params.name) setName(params.name as string);
    if (params.email) setEmail(params.email as string);
    if (params.phone) setPhone(params.phone as string);
  }, [params]);

  const handleSave = () => {
    // TODO: Call API to save profile changes
    router.back();
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
        {/* Profile Picture */}
        <View className="items-center mb-8">
          <Image
            source={{ uri: INITIAL_USER_DATA.avatar }}
            style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 12 }}
          />
          <TouchableOpacity>
            <Text className="text-base font-semibold" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
              Change Photo
            </Text>
          </TouchableOpacity>
        </View>

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
            placeholder="Enter your name"
            placeholderTextColor="#6b7280"
          />
        </View>

        {/* Email Input */}
        <View className="mb-4">
          <Text className="text-sm font-semibold mb-2" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            Email
          </Text>
          <TextInput
            className="px-4 py-3 rounded-2xl"
            style={{ backgroundColor: '#E8F3E0', color: '#2C4A34', fontFamily: 'System' }}
            value={email}
            onChangeText={setEmail}
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
          className="py-4 rounded-2xl mb-4"
          style={{ backgroundColor: '#C85E51' }}
        >
          <Text className="text-base font-semibold text-center" style={{ color: '#ffffff', fontFamily: 'System' }}>
            Save
          </Text>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          onPress={handleCancel}
          className="py-4 rounded-2xl"
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

