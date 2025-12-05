import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, Share2, Gift } from 'lucide-react-native';
import '../../global.css';

export default function ReferralsScreen() {
  const router = useRouter();
  const referralCode = 'VEGGIE2024';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join me on Second Chances! Use my referral code: ${referralCode} to get started.`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

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
          Referrals
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View className="flex-1 px-4 pt-8">
        {/* Referral Code Card */}
        <View className="items-center mb-8">
          <Gift size={64} stroke="#E8F3E0" />
          <Text className="text-lg font-semibold mt-4 mb-2" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            Your Referral Code
          </Text>
          <View
            className="px-6 py-4 rounded-3xl mb-4"
            style={{ backgroundColor: '#E8F3E0', minWidth: 200 }}
          >
            <Text className="text-2xl font-bold text-center" style={{ color: '#2C4A34', fontFamily: 'System' }}>
              {referralCode}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleShare}
            className="flex-row items-center px-6 py-3 rounded-3xl"
            style={{ backgroundColor: '#C85E51' }}
          >
            <Share2 size={20} stroke="#ffffff" />
            <Text className="text-white text-base font-semibold ml-2" style={{ fontFamily: 'System' }}>
              Share Code
            </Text>
          </TouchableOpacity>
        </View>

        {/* Benefits */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-4" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            How It Works
          </Text>
          <View className="mb-3">
            <Text className="text-base font-semibold mb-1" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
              1. Share your code
            </Text>
            <Text className="text-sm" style={{ color: '#E8F3E0', fontFamily: 'System', opacity: 0.8 }}>
              Share your referral code with friends and family
            </Text>
          </View>
          <View className="mb-3">
            <Text className="text-base font-semibold mb-1" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
              2. They sign up
            </Text>
            <Text className="text-sm" style={{ color: '#E8F3E0', fontFamily: 'System', opacity: 0.8 }}>
              Your friends use your code when creating an account
            </Text>
          </View>
          <View>
            <Text className="text-base font-semibold mb-1" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
              3. You both get rewards
            </Text>
            <Text className="text-sm" style={{ color: '#E8F3E0', fontFamily: 'System', opacity: 0.8 }}>
              Earn points when they make their first order
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View className="p-4 rounded-3xl" style={{ backgroundColor: '#E8F3E0' }}>
          <Text className="text-base font-semibold mb-2" style={{ color: '#2C4A34', fontFamily: 'System' }}>
            Your Referrals
          </Text>
          <Text className="text-3xl font-bold" style={{ color: '#2C4A34', fontFamily: 'System' }}>
            0
          </Text>
          <Text className="text-sm mt-1" style={{ color: '#6b7280', fontFamily: 'System' }}>
            Total people referred
          </Text>
        </View>
      </View>
    </View>
  );
}

