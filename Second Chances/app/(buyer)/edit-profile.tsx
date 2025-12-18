import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import '../../global.css';
import { API_URL } from '../../config/api';
import { getAuthToken } from '../../config/auth';

export default function EditProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.name) setName(params.name as string);
    if (params.email) setEmail(params.email as string);
    if (params.phone) setPhone(params.phone as string);
  }, [params]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        Alert.alert('Error', 'You need to be logged in');
        router.replace('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Error', data?.error || 'Failed to update profile');
        return;
      }

      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Unable to update profile. Please try again.');
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
            placeholder="Enter your name"
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
          className="py-4 rounded-2xl mb-4"
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

