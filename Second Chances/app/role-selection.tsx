import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Package, ShoppingBag } from 'lucide-react-native';
import '../global.css';

export default function RoleSelectionScreen() {
  const router = useRouter();

  return (
    <View className="flex-1" style={{ backgroundColor: '#365441' }}>
      <View className="flex-1 items-center justify-center px-6">
        {/* Logo and App Name - Centered */}
        <View className="items-center mb-8">
          <Image 
            source={require('../assets/logo.png')} 
                  style={{ 
              width: 180, 
              height: 180,
              marginBottom: 16,
                  }}
            resizeMode="contain"
          />
          <Text className="text-4xl font-bold text-center" style={{ color: '#cee4b0', fontFamily: 'System' }}>
            Second Chances
              </Text>
          </View>

        {/* Title */}
        <View className="items-center mb-6">
          <Text className="text-xl font-bold text-center" style={{ color: '#cee4b0', fontFamily: 'System' }}>
              Choose your Journey
            </Text>
          </View>

        {/* Role Cards - Semi-transparent Squares */}
        <View className="w-full gap-3">
            {/* Seller Card */}
            <TouchableOpacity 
            onPress={() => {
              router.push({ pathname: '/register', params: { role: 'seller' } });
            }}
            className="items-center justify-center"
                    style={{ 
              width: '100%',
              height: 140,
              borderWidth: 2,
              borderColor: '#E8F3E0',
              borderRadius: 16,
              backgroundColor: 'rgba(232, 243, 224, 0.2)',
            }}
          >
            <Package size={48} stroke="#E8F3E0" style={{ marginBottom: 8 }} />
            <Text className="text-base font-semibold mb-1" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                  I want to
                </Text>
            <Text className="text-xl font-bold" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                  Share Harvest
                </Text>
            </TouchableOpacity>

            {/* Buyer Card */}
            <TouchableOpacity 
            onPress={() => {
              router.push({ pathname: '/register', params: { role: 'buyer' } });
            }}
            className="items-center justify-center"
                    style={{ 
              width: '100%',
              height: 140,
                      borderWidth: 2,
              borderColor: '#E8F3E0',
              borderRadius: 16,
              backgroundColor: 'rgba(232, 243, 224, 0.2)',
                    }}
                  >
            <ShoppingBag size={48} stroke="#E8F3E0" style={{ marginBottom: 8 }} />
            <Text className="text-base font-semibold mb-1" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                  I want to
                </Text>
            <Text className="text-xl font-bold" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                  Rescue Food
              </Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

