import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Package, ShoppingBag } from 'lucide-react-native';
import '../global.css';
import { getAuthToken } from '../config/auth';
import { API_URL } from '../config/api';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      const token = getAuthToken();
      if (!token) {
        router.replace('/login');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const user = await response.json();
          const roles = user.roles || [];
          // If user already has a role, navigate to their home
          if (roles.includes('seller')) {
            router.replace('/(seller)/dashboard');
          } else if (roles.includes('buyer')) {
            router.replace('/(buyer)/home');
          } else {
            // New user without role, show selection
            setLoading(false);
          }
        } else {
          router.replace('/login');
        }
      } catch (error) {
        router.replace('/login');
      }
    };

    checkUserRole();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: '#365441' }}>
        <ActivityIndicator size="large" color="#E8F3E0" />
      </View>
    );
  }

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

