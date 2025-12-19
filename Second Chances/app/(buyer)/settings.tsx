import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, Switch, Alert, Image, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ArrowLeft, Pencil, ChevronRight, User, Bell, ShieldCheck, Info } from 'lucide-react-native';
import '../../global.css';
import { API_URL } from '../../config/api';
import { getAuthToken, clearAuthToken, setPreferredRole } from '../../config/auth';

const APP_VERSION = 'v1.0.2';

export default function SettingsScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promoUpdates, setPromoUpdates] = useState(false);
  const [communityUpdates, setCommunityUpdates] = useState(true);
  const [isSeller, setIsSeller] = useState(false);

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
        setOrderUpdates(data.settings.emailNotifications ?? true);
        setPromoUpdates(data.settings.pushNotifications ?? false);
      }
      // On buyer settings screen, user is always in buyer view
      // isSeller should be false unless they explicitly switch
      setIsSeller(false);
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
      pathname: '/(buyer)/edit-profile',
      params: {
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
      },
    });
  };

  const handleChangePassword = () => {
    // TODO: Navigate to change password screen
    console.log('Change password');
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
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
    ]);
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
        <Text
          className="text-xl font-bold flex-1 text-center"
          style={{ color: '#ffffff', fontFamily: 'System' }}
        >
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
            {/* Profile Overview */}
            <View className="items-center mb-6 mt-4">
              {userData?.avatar ? (
                <Image
                  source={{ uri: userData.avatar.startsWith('http') ? userData.avatar : `${API_URL}${userData.avatar}` }}
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

              <View className="flex-row items-center mb-1">
                <Text
                  className="text-2xl font-bold mr-3"
                  style={{ color: '#E8F3E0', fontFamily: 'System' }}
                >
                  {userData?.name || 'User'}
                </Text>
                <TouchableOpacity onPress={handleEditProfile}>
                  <Pencil size={18} stroke="#E8F3E0" />
                </TouchableOpacity>
              </View>

              <Text
                className="text-sm mb-1"
                style={{ color: '#E8F3E0', fontFamily: 'System' }}
              >
                {userData?.email || ''}
              </Text>
              <Text
                className="text-sm"
                style={{ color: '#E8F3E0', fontFamily: 'System' }}
              >
                {userData?.phone || ''}
              </Text>
            </View>

        {/* Account Section */}
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
          <Text
            className="text-lg font-bold mb-4"
            style={{ color: '#2C4A34', fontFamily: 'System' }}
          >
            Account
          </Text>

          {/* Personal details */}
          <TouchableOpacity
            onPress={handleEditProfile}
            className="flex-row items-center justify-between py-3 border-b"
            style={{ borderBottomColor: '#2C4A34', borderBottomWidth: 1 }}
          >
            <Text
              className="text-base"
              style={{ color: '#2C4A34', fontFamily: 'System' }}
            >
              Personal details
            </Text>
            <ChevronRight size={18} stroke="#2C4A34" />
          </TouchableOpacity>

          {/* Addresses */}
          <TouchableOpacity
            onPress={() => router.push('/(buyer)/addresses')}
            className="flex-row items-center justify-between py-3 border-b"
            style={{ borderBottomColor: '#2C4A34', borderBottomWidth: 1 }}
          >
            <Text
              className="text-base"
              style={{ color: '#2C4A34', fontFamily: 'System' }}
            >
              Addresses
            </Text>
            <ChevronRight size={18} stroke="#2C4A34" />
          </TouchableOpacity>

          {/* Payment methods */}
          <TouchableOpacity
            onPress={() => router.push('/(buyer)/payments')}
            className="flex-row items-center justify-between py-3 border-b"
            style={{ borderBottomColor: '#2C4A34', borderBottomWidth: 1 }}
          >
            <Text
              className="text-base"
              style={{ color: '#2C4A34', fontFamily: 'System' }}
            >
              Payment methods
            </Text>
            <ChevronRight size={18} stroke="#2C4A34" />
          </TouchableOpacity>

          {/* Change password */}
          <TouchableOpacity
            onPress={handleChangePassword}
            className="flex-row items-center justify-between py-3"
          >
            <Text
              className="text-base"
              style={{ color: '#2C4A34', fontFamily: 'System' }}
            >
              Change password
            </Text>
            <ChevronRight size={18} stroke="#2C4A34" />
          </TouchableOpacity>
        </View>
        {/* Notification Preferences */}
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
          <View className="flex-row items-center mb-3">
            <View
              className="items-center justify-center mr-3"
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: '#2C4A34',
              }}
            >
              <Bell size={18} stroke="#E8F3E0" />
            </View>
            <Text
              className="text-lg font-bold"
              style={{ color: '#2C4A34', fontFamily: 'System' }}
            >
              Notifications
            </Text>
          </View>

          <View
            className="flex-row items-center justify-between py-3"
            style={{ borderTopWidth: 1, borderTopColor: '#2C4A34' }}
          >
            <View className="flex-1 mr-4">
              <Text
                className="text-base font-semibold"
                style={{ color: '#2C4A34', fontFamily: 'System' }}
              >
                Order updates
              </Text>
              <Text
                className="text-xs mt-1"
                style={{ color: '#6b7280', fontFamily: 'System' }}
              >
                Status changes, delivery updates and important order alerts.
              </Text>
            </View>
            <Switch
              value={orderUpdates}
              onValueChange={setOrderUpdates}
              trackColor={{ false: '#6b7280', true: '#2C4A34' }}
              thumbColor="#ffffff"
            />
          </View>

          <View
            className="flex-row items-center justify-between py-3"
            style={{ borderTopWidth: 1, borderTopColor: '#2C4A34' }}
          >
            <View className="flex-1 mr-4">
              <Text
                className="text-base font-semibold"
                style={{ color: '#2C4A34', fontFamily: 'System' }}
              >
                Promotions & rewards
              </Text>
              <Text
                className="text-xs mt-1"
                style={{ color: '#6b7280', fontFamily: 'System' }}
              >
                New rewards, limited-time deals and referral perks.
              </Text>
            </View>
            <Switch
              value={promoUpdates}
              onValueChange={setPromoUpdates}
              trackColor={{ false: '#6b7280', true: '#2C4A34' }}
              thumbColor="#ffffff"
            />
          </View>

          <View
            className="flex-row items-center justify-between py-3"
            style={{ borderTopWidth: 1, borderTopColor: '#2C4A34' }}
          >
            <View className="flex-1 mr-4">
              <Text
                className="text-base font-semibold"
                style={{ color: '#2C4A34', fontFamily: 'System' }}
              >
                Community & tips
              </Text>
              <Text
                className="text-xs mt-1"
                style={{ color: '#6b7280', fontFamily: 'System' }}
              >
                Helpful storage tips, recipes and community highlights.
              </Text>
            </View>
            <Switch
              value={communityUpdates}
              onValueChange={setCommunityUpdates}
              trackColor={{ false: '#6b7280', true: '#2C4A34' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Switch Role */}
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
          <Text
            className="text-lg font-bold mb-2"
            style={{ color: '#2C4A34', fontFamily: 'System' }}
          >
            Switch role
          </Text>
          <View 
            className="mb-3 px-3 py-2 rounded-xl"
            style={{ backgroundColor: '#2C4A34' }}
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: '#E8F3E0', fontFamily: 'System' }}
            >
              {isSeller ? 'You are currently in Seller role' : 'You are currently in Buyer role'}
            </Text>
          </View>
          <Text
            className="text-xs mb-3"
            style={{ color: '#6b7280', fontFamily: 'System' }}
          >
            Swap between buyer and seller views. This only affects what you see
            in the app.
          </Text>
          <View className="flex-row" style={{ gap: 8 }}>
            <TouchableOpacity
              onPress={() => {
                if (!isSeller) {
                  Alert.alert(
                    'Switch to Seller View',
                    'Are you sure you want to switch to Seller view? Your buyer data (orders, favorites) will remain separate and unchanged.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Switch',
                        style: 'destructive',
                        onPress: async () => {
                          try {
                            const token = getAuthToken();
                            if (token) {
                              // Add seller role to user account
                              await fetch(`${API_URL}/api/user/add-role`, {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({ role: 'seller' }),
                              });
                            }
                            setIsSeller(true);
                            await setPreferredRole('seller');
                            router.replace('/(seller)/dashboard');
                          } catch (error) {
                            console.error('Error adding role:', error);
                            // Still switch even if API call fails
                            setIsSeller(true);
                            await setPreferredRole('seller');
                            router.replace('/(seller)/dashboard');
                          }
                        },
                      },
                    ]
                  );
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
                  fontFamily: 'System',
                }}
              >
                Seller
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (isSeller) {
                  Alert.alert(
                    'Switch to Buyer View',
                    'Are you sure you want to switch to Buyer view? Your seller data (products, stock) will remain separate and unchanged.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Switch',
                        style: 'destructive',
                        onPress: async () => {
                          try {
                            const token = getAuthToken();
                            if (token) {
                              // Add buyer role to user account
                              await fetch(`${API_URL}/api/user/add-role`, {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({ role: 'buyer' }),
                              });
                            }
                            setIsSeller(false);
                            await setPreferredRole('buyer');
                            router.replace('/(buyer)/home');
                          } catch (error) {
                            console.error('Error adding role:', error);
                            // Still switch even if API call fails
                            setIsSeller(false);
                            await setPreferredRole('buyer');
                            router.replace('/(buyer)/home');
                          }
                        },
                      },
                    ]
                  );
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
                  fontFamily: 'System',
                }}
              >
                Buyer
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account & Safety helper */}
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
          <View className="flex-row items-center mb-3">
            <View
              className="items-center justify-center mr-3"
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: '#2C4A34',
              }}
            >
              <ShieldCheck size={18} stroke="#E8F3E0" />
            </View>
            <Text
              className="text-lg font-bold"
              style={{ color: '#2C4A34', fontFamily: 'System' }}
            >
              Account & safety
            </Text>
          </View>

          <Text
            className="text-sm mb-2"
            style={{ color: '#2C4A34', fontFamily: 'System' }}
          >
            Manage your profile, addresses and payment methods from this page.
          </Text>
          <Text
            className="text-xs"
            style={{ color: '#6b7280', fontFamily: 'System' }}
          >
            For security reasons, sensitive changes like password and phone
            number may require re‑authentication.
          </Text>
        </View>

        {/* App Info */}
        <View
          style={{
            backgroundColor: '#E8F3E0',
            borderRadius: 24,
            padding: 16,
            borderWidth: 1,
            borderColor: '#2C4A34',
          }}
        >
          <View className="flex-row items-center mb-3">
            <View
              className="items-center justify-center mr-3"
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: '#2C4A34',
              }}
            >
              <Info size={18} stroke="#E8F3E0" />
            </View>
            <Text
              className="text-lg font-bold"
              style={{ color: '#2C4A34', fontFamily: 'System' }}
            >
              About Second Chances
            </Text>
          </View>

          <Text
            className="text-sm mb-1"
            style={{ color: '#2C4A34', fontFamily: 'System' }}
          >
            Version {APP_VERSION}
          </Text>
          <Text
            className="text-xs"
            style={{ color: '#6b7280', fontFamily: 'System' }}
          >
            Helping buyers rescue good food, support local sellers and reduce
            waste — one blind box at a time.
          </Text>
        </View>

            {/* Log Out Button */}
            <TouchableOpacity
              onPress={handleLogout}
              className="py-4 rounded-3xl mb-4"
              style={{ backgroundColor: '#C85E51', marginTop: 16 }}
            >
              <Text
                className="text-base font-semibold text-center"
                style={{ color: '#ffffff', fontFamily: 'System' }}
              >
                Log Out
              </Text>
            </TouchableOpacity>

            {/* Delete Account */}
            <TouchableOpacity
              onPress={handleDeleteAccount}
              className="items-center py-2"
            >
              <Text
                className="text-sm"
                style={{ color: '#C85E51', fontFamily: 'System' }}
              >
                Delete Account
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}
