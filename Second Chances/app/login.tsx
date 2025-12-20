import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch, Image, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { User, Eye, EyeOff } from 'lucide-react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import '../global.css';
import { API_URL } from '../config/api';
import { setAuthToken } from '../config/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // Clear previous errors
    setError('');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !email.trim()) {
      setError('Email is required');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate password
    if (!password || password.length === 0) {
      setError('Password is required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const loginUrl = `${API_URL}/api/auth/login`;
      console.log('Attempting login to:', loginUrl);

      // Create timeout abort controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), password }),
        signal: controller.signal,
      }).catch((fetchError: any) => {
        clearTimeout(timeoutId);
        console.error('Fetch error details:', {
          name: fetchError?.name,
          message: fetchError?.message,
          code: fetchError?.code,
          url: loginUrl,
        });
        throw fetchError;
      });

      clearTimeout(timeoutId);

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData?.errors?.[0]?.msg || errorData?.error || `Server error: ${response.status}`;
        } catch (parseError) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        
        // Show user-friendly message
        if (errorMessage.toLowerCase().includes('invalid') || errorMessage.toLowerCase().includes('credentials')) {
          setError('Invalid email or password');
        } else {
          setError(errorMessage);
        }
        return;
      }

      const data = await response.json();

      // Validate that we got a token and user data
      if (!data.token || !data.user) {
        setError('Invalid response from server');
        return;
      }

      await setAuthToken(data.token);
      
      // Navigate based on user role
      const userRoles = data.user.roles || [];
      if (userRoles.includes('seller')) {
        router.replace('/(seller)/dashboard');
      } else {
        router.replace('/(buyer)/home');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Provide more specific error messages
      let errorMessage = 'Unable to reach server. Please try again.';
      
      if (err?.name === 'AbortError') {
        errorMessage = 'Request timed out after 30 seconds. The backend may be slow to respond. Please try again.';
      } else if (err?.message?.includes('Network request failed')) {
        errorMessage = `Cannot connect to server at ${API_URL}.\n\nPlease check:\n• Your internet connection\n• If backend is accessible\n• Try the debug screen to test connection`;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
                placeholder="Email"
                placeholderTextColor="#6b7280"
                className="flex-1 text-base"
                style={{ color: '#2C4A34', fontFamily: 'System' }}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
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
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} stroke="#6b7280" /> : <Eye size={20} stroke="#6b7280" />}
              </TouchableOpacity>
            </View>
          </View>

          {error ? (
            <View className="mb-3">
              <Text className="text-sm" style={{ color: '#C85E51', fontFamily: 'System' }}>
                {error}
              </Text>
            </View>
          ) : null}

          {/* Remember Me and Forgot Password */}
          <View className="flex-row items-center justify-between mb-3">
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
            <TouchableOpacity onPress={() => router.push('/forgot-password')}>
              <Text className="text-base font-semibold" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity 
          className="bg-terracotta py-4 px-8 rounded-3xl items-center mb-6"
          onPress={handleLogin}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
          <Text className="text-white text-lg font-bold uppercase" style={{ fontFamily: 'System' }}>
            LOGIN
          </Text>
          )}
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

