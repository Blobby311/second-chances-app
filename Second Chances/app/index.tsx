import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import '../global.css';

export default function SplashScreen() {
  const router = useRouter();

  return (
    <View className="flex-1" style={{ backgroundColor: '#365441' }}>
      <View className="flex-1 items-center justify-center px-6">
        {/* Welcome Text */}
        <View className="items-center mb-8">
          <Text className="text-4xl font-bold text-center" style={{ color: '#cee4b0', fontFamily: 'System' }}>
            Welcome to
          </Text>
        </View>
        
        {/* Central Logo - Matching login screen */}
        <View className="items-center mb-8">
          <Image 
            source={require('../assets/logo.png')} 
            style={{ 
              width: 200, 
              height: 200,
              margin: 0,
              padding: 0
            }}
            resizeMode="contain"
          />
      </View>

        {/* App Name and Tagline */}
      <View className="items-center mb-12">
        <Text className="text-4xl font-bold mb-2 text-center" style={{ fontFamily: 'System', color: '#cee4b0' }}>
            Second Chances
        </Text>
        <Text className="text-base text-center" style={{ fontFamily: 'System', color: '#cee4b0' }}>
            Delicious surprises, sustainable choices every day
        </Text>
      </View>

      {/* Call to Action */}
      <View className="w-full mb-8">
        <TouchableOpacity
          className="bg-terracotta py-4 px-8 rounded-3xl items-center"
          onPress={() => router.push('/login')}
        >
            <Text className="text-white text-lg font-bold uppercase" style={{ fontFamily: 'System' }}>
            Get Started
          </Text>
        </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <Text className="text-xs text-gray-400 absolute bottom-10 self-center" style={{ fontFamily: 'System' }}>
        © 2025 Second Chances
      </Text>
    </View>
  );
}

