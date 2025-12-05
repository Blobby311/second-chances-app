import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { User, Eye, EyeOff } from 'lucide-react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import '../global.css';

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <View className="flex-1" style={{ backgroundColor: '#365441' }}>
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 160 }}
      >
        <View className="px-6">
        {/* Header - Centered */}
        <View className="items-center mb-8">
          <Text className="text-4xl font-bold mb-2 text-center" style={{ color: '#cee4b0', fontFamily: 'System' }}>
            Welcome Back!
          </Text>
          <Text className="text-base text-center" style={{ color: '#cee4b0', fontFamily: 'System' }}>
            Your sustainable journey continues
          </Text>
        </View>

        {/* Central Logo - Exact match to splash screen */}
        <View className="items-center">
          {/* Main Logo - Large and Prominent */}
          <View className="mb-6">
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
        </View>

        {/* Input Fields */}
        <View className="mb-6">
          {/* Username Field */}
          <View className="mb-4">
            <View 
              className="flex-row items-center px-4 py-3 rounded-2xl"
              style={{ backgroundColor: '#E8F3E0' }}
            >
              <TextInput
                placeholder="Username"
                placeholderTextColor="#6b7280"
                className="flex-1 text-base"
                style={{ color: '#2C4A34', fontFamily: 'System' }}
              />
              <User size={20} stroke="#6b7280" />
            </View>
          </View>

          {/* Password Field */}
          <View className="mb-3">
            <View 
              className="flex-row items-center px-4 py-3 rounded-2xl"
              style={{ backgroundColor: '#E8F3E0' }}
            >
              <TextInput
                placeholder="Password"
                placeholderTextColor="#6b7280"
                secureTextEntry={!showPassword}
                className="flex-1 text-base"
                style={{ color: '#2C4A34', fontFamily: 'System' }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} stroke="#6b7280" /> : <Eye size={20} stroke="#6b7280" />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember Me */}
          <View className="flex-row items-center">
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
              trackColor={{ false: '#d1d5db', true: '#C85E51' }}
              thumbColor={rememberMe ? '#ffffff' : '#f3f4f6'}
            />
            <Text className="ml-2 text-base" style={{ color: '#6b7280', fontFamily: 'System' }}>
              Remember me
            </Text>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity 
          className="bg-terracotta py-4 px-8 rounded-3xl items-center mb-6"
          onPress={() => {
            // TODO: Handle login
            router.push('/role-selection');
          }}
        >
          <Text className="text-white text-lg font-bold uppercase" style={{ fontFamily: 'System' }}>
            LOGIN
          </Text>
        </TouchableOpacity>

        {/* OR Separator */}
        <View className="flex-row items-center justify-center mb-4">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-4 text-base" style={{ color: '#6b7280', fontFamily: 'System' }}>
            OR
          </Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        {/* Social Login Icons */}
        <View className="flex-row justify-center items-center mb-4 gap-4">
          {/* Facebook */}
          <TouchableOpacity 
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: '#1877f2' }}
            onPress={() => {
              // TODO: Handle Facebook login
            }}
          >
            <FontAwesome5 name="facebook-f" size={20} color="#ffffff" />
          </TouchableOpacity>

          {/* Google */}
          <TouchableOpacity 
            className="w-12 h-12 rounded-full items-center justify-center bg-white border border-gray-300"
            onPress={() => {
              // TODO: Handle Google login
            }}
          >
            <FontAwesome5 name="google" size={20} color="#4285f4" />
          </TouchableOpacity>

          {/* Apple */}
          <TouchableOpacity 
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: '#000000' }}
            onPress={() => {
              // TODO: Handle Apple login
            }}
          >
            <FontAwesome5 name="apple" size={20} color="#ffffff" />
          </TouchableOpacity>

          {/* TikTok */}
          <TouchableOpacity 
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: '#000000' }}
            onPress={() => {
              // TODO: Handle TikTok login
            }}
          >
            <FontAwesome5 name="tiktok" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View className="items-center mb-8">
          <Text className="text-base" style={{ color: '#6b7280', fontFamily: 'System' }}>
            Don't have an account?{' '}
            <Link href="/role-selection" asChild>
              <Text className="font-semibold" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                Sign Up
              </Text>
            </Link>
          </Text>
        </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <Text className="text-xs text-gray-400 absolute bottom-10 self-center" style={{ fontFamily: 'System' }}>
        © 2025 Second Chances
      </Text>
    </View>
  );
}

