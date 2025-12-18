import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Switch, Alert, Image, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ArrowLeft, Pencil, ChevronRight, User } from 'lucide-react-native';
import '../../global.css';
import { API_URL } from '../../config/api';
import { getAuthToken, clearAuthToken } from '../../config/auth';

const APP_VERSION = 'v1.0.2';

export default function SettingsScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [isSeller, setIsSeller] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        router.replace('/login');
        return;
      }

      const response = await fetch(`${API_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          await clearAuthToken();
          router.replace('/login');
          return;
        }
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUserData(data);
      if (data.settings) {
        setEmailUpdates(data.settings.emailNotifications ?? true);
        setPushNotifications(data.settings.pushNotifications ?? true);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserProfile();
    }, [])
  );

  const handleEditProfile = () => {
    if (!userData) return;
    router.push({
      pathname: '/(seller)/edit-profile',
      params: {
        name: userData.name || '',
        fullName: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
      },
    });
  };

  const handleChangePassword = () => {
    // TODO: Navigate to change password screen
    console.log('Change password');
  };

  const handleLanguage = () => {
    // TODO: Navigate to language selection screen
    console.log('Language selection');
  };

  const handleTheme = () => {
    // TODO: Navigate to theme selection screen
    console.log('Theme selection');
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = getAuthToken();
              if (token) {
                await fetch(`${API_URL}/api/auth/logout`, {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
              }
            } catch {
              // ignore, still clear locally
            } finally {
              await clearAuthToken();
              router.replace('/login');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = getAuthToken();
              if (!token) {
                Alert.alert('Error', 'You need to be logged in to delete your account.');
                return;
              }

              const response = await fetch(`${API_URL}/api/user/account`, {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (!response.ok) {
                const data = await response.json();
                Alert.alert('Error', data?.error || 'Failed to delete account.');
                return;
              }

              await clearAuthToken();
              Alert.alert('Account deleted', 'Your account has been deleted.', [
                {
                  text: 'OK',
                  onPress: () => router.replace('/login'),
                },
              ]);
            } catch {
              Alert.alert('Error', 'Unable to delete account. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#365441' }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View
        className="flex-row items-center px-4"
        style={{ backgroundColor: '#2C4A34', paddingTop: 60, paddingBottom: 12 }}
      >
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} stroke="#ffffff" />
        </TouchableOpacity>
        <Text className="text-xl font-bold flex-1 text-center" style={{ color: '#ffffff', fontFamily: 'System' }}>
          Settings
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View className="items-center justify-center" style={{ minHeight: 200 }}>
            <ActivityIndicator size="large" color="#E8F3E0" />
          </View>
        ) : (
          <>
            {/* User Profile Section */}
            <View className="items-center mb-6 mt-4">
              {/* Avatar */}
              {userData?.avatar ? (
                <Image
                  source={{ uri: userData.avatar.startsWith('http') ? userData.avatar : `${API_URL}${userData.avatar}` }}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    marginBottom: 16,
                    borderWidth: 3,
                    borderColor: '#2C4A34',
                  }}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    backgroundColor: '#E8F3E0',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                    borderWidth: 3,
                    borderColor: '#2C4A34',
                  }}
                >
                  <User size={60} stroke="#2C4A34" fill="#2C4A34" />
                </View>
              )}

              {/* Username with Edit Icon */}
              <View className="flex-row items-center mb-1">
                <Text className="text-2xl font-bold mr-3" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                  {userData?.name || 'User'}
                </Text>
                <TouchableOpacity onPress={handleEditProfile}>
                  <Pencil size={20} stroke="#E8F3E0" />
                </TouchableOpacity>
              </View>

              {/* Email and Phone */}
              <View className="flex-row items-center">
                <Text className="text-sm" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                  {userData?.email || ''}
                </Text>
                {userData?.phone && (
                  <>
                    <Text className="text-sm mx-2" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                      |
                    </Text>
                    <Text className="text-sm" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                      {userData.phone}
                    </Text>
                  </>
                )}
              </View>
            </View>

        {/* Account Settings Section */}
        <View
          style={{
            backgroundColor: '#E8F3E0',
            borderRadius: 24,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#2C4A34',
          }}
        >
          <Text className="text-lg font-bold mb-4" style={{ color: '#2C4A34', fontFamily: 'System' }}>
            Account
          </Text>

          {/* Change Password */}
          <TouchableOpacity
            onPress={handleChangePassword}
            className="flex-row items-center justify-between py-3 border-b"
            style={{ borderBottomColor: '#2C4A34', borderBottomWidth: 1 }}
          >
            <Text className="text-base" style={{ color: '#2C4A34', fontFamily: 'System' }}>
              Change Password
            </Text>
            <ChevronRight size={20} stroke="#2C4A34" />
          </TouchableOpacity>

          {/* Email Updates */}
          <View className="flex-row items-center justify-between py-3 border-b" style={{ borderBottomColor: '#2C4A34', borderBottomWidth: 1 }}>
            <Text className="text-base" style={{ color: '#2C4A34', fontFamily: 'System' }}>
              Email Updates
            </Text>
            <Switch
              value={emailUpdates}
              onValueChange={setEmailUpdates}
              trackColor={{ false: '#6b7280', true: '#2C4A34' }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Push Notifications */}
          <View className="flex-row items-center justify-between py-3">
            <Text className="text-base" style={{ color: '#2C4A34', fontFamily: 'System' }}>
              Push Notifications
            </Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#6b7280', true: '#2C4A34' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* App Settings Section */}
        <View
          style={{
            backgroundColor: '#E8F3E0',
            borderRadius: 24,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#2C4A34',
          }}
        >
          <Text className="text-lg font-bold mb-4" style={{ color: '#2C4A34', fontFamily: 'System' }}>
            App
          </Text>

          {/* Switch Role */}
          <View className="py-3 border-b" style={{ borderBottomColor: '#2C4A34', borderBottomWidth: 1 }}>
            <Text className="text-base mb-3" style={{ color: '#2C4A34', fontFamily: 'System' }}>
              Switch Role
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  if (!isSeller) {
                    setIsSeller(true);
                    router.replace('/(seller)/dashboard');
                  }
                }}
                className="flex-1 py-3 rounded-2xl"
                style={{ 
                  backgroundColor: isSeller ? '#2C4A34' : '#E8F3E0',
                  borderWidth: 1,
                  borderColor: '#2C4A34',
                }}
              >
                <Text 
                  className="text-base font-semibold text-center" 
                  style={{ 
                    color: isSeller ? '#E8F3E0' : '#2C4A34', 
                    fontFamily: 'System' 
                  }}
                >
                  Seller
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (isSeller) {
                    setIsSeller(false);
                    router.replace('/(buyer)/home');
                  }
                }}
                className="flex-1 py-3 rounded-2xl"
                style={{ 
                  backgroundColor: !isSeller ? '#2C4A34' : '#E8F3E0',
                  borderWidth: 1,
                  borderColor: '#2C4A34',
                }}
              >
                <Text 
                  className="text-base font-semibold text-center" 
                  style={{ 
                    color: !isSeller ? '#E8F3E0' : '#2C4A34', 
                    fontFamily: 'System' 
                  }}
                >
                  Buyer
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Language */}
          <TouchableOpacity
            onPress={handleLanguage}
            className="flex-row items-center justify-between py-3 border-b"
            style={{ borderBottomColor: '#2C4A34', borderBottomWidth: 1 }}
          >
            <Text className="text-base" style={{ color: '#2C4A34', fontFamily: 'System' }}>
              Language
            </Text>
            <View className="flex-row items-center">
              <Text className="text-base mr-2" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                English
              </Text>
              <ChevronRight size={20} stroke="#2C4A34" />
            </View>
          </TouchableOpacity>

          {/* Theme */}
          <TouchableOpacity
            onPress={handleTheme}
            className="flex-row items-center justify-between py-3 border-b"
            style={{ borderBottomColor: '#2C4A34', borderBottomWidth: 1 }}
          >
            <Text className="text-base" style={{ color: '#2C4A34', fontFamily: 'System' }}>
              Theme
            </Text>
            <View className="flex-row items-center">
              <Text className="text-base mr-2" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                System Default
              </Text>
              <ChevronRight size={20} stroke="#2C4A34" />
            </View>
          </TouchableOpacity>

          {/* Version */}
          <View className="flex-row items-center justify-between py-3">
            <Text className="text-base" style={{ color: '#2C4A34', fontFamily: 'System' }}>
              Version
            </Text>
            <Text className="text-base" style={{ color: '#2C4A34', fontFamily: 'System' }}>
              {APP_VERSION}
            </Text>
          </View>
        </View>

            {/* Log Out Button */}
            <TouchableOpacity
              onPress={handleLogout}
              className="py-4 rounded-3xl mb-4"
              style={{ backgroundColor: '#C85E51' }}
            >
              <Text className="text-base font-semibold text-center" style={{ color: '#ffffff', fontFamily: 'System' }}>
                Log Out
              </Text>
            </TouchableOpacity>

            {/* Delete Account */}
            <TouchableOpacity onPress={handleDeleteAccount} className="items-center py-2">
              <Text className="text-sm" style={{ color: '#C85E51', fontFamily: 'System' }}>
                Delete Account
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

