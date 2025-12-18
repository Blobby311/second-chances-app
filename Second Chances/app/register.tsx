import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import { User, Eye, EyeOff, Mail, Lock } from 'lucide-react-native';
import '../global.css';
import { API_URL } from '../config/api';
import { setAuthToken } from '../config/auth';

export default function RegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const role = (params.role as string) || 'buyer'; // Default to buyer if no role passed

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');

      console.log('Registering with:', { name, email, role, apiUrl: API_URL });
      
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();
      console.log('Registration response:', { status: response.status, data });

      if (!response.ok) {
        const message = data?.errors?.[0]?.msg || data?.error || 'Registration failed';
        console.error('Registration failed:', message);
        setError(message);
        return;
      }

      // Save token
      await setAuthToken(data.token);

      // Navigate based on role
      if (role === 'seller') {
        router.replace('/(seller)/dashboard');
      } else {
        router.replace('/(buyer)/home');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err?.message || 'Unable to reach server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#365441' }}>
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 60 }}
      >
        <View className="px-6">
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-4xl font-bold mb-2 text-center" style={{ color: '#cee4b0', fontFamily: 'System' }}>
              Create Account
            </Text>
            <Text className="text-base text-center" style={{ color: '#cee4b0', fontFamily: 'System' }}>
              Join Second Chances as a {role === 'seller' ? 'Seller' : 'Buyer'}
            </Text>
          </View>

          {/* Input Fields */}
          <View className="mb-6">
            {/* Name Field */}
            <View className="mb-4">
              <View 
                className="flex-row items-center px-4 py-3 rounded-2xl"
                style={{ backgroundColor: '#E8F3E0' }}
              >
                <User size={20} stroke="#6b7280" />
                <TextInput
                  placeholder="Full Name"
                  placeholderTextColor="#6b7280"
                  className="flex-1 ml-3 text-base"
                  style={{ color: '#2C4A34', fontFamily: 'System' }}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Field */}
            <View className="mb-4">
              <View 
                className="flex-row items-center px-4 py-3 rounded-2xl"
                style={{ backgroundColor: '#E8F3E0' }}
              >
                <Mail size={20} stroke="#6b7280" />
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#6b7280"
                  className="flex-1 ml-3 text-base"
                  style={{ color: '#2C4A34', fontFamily: 'System' }}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password Field */}
            <View className="mb-4">
              <View 
                className="flex-row items-center px-4 py-3 rounded-2xl"
                style={{ backgroundColor: '#E8F3E0' }}
              >
                <Lock size={20} stroke="#6b7280" />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#6b7280"
                  secureTextEntry={!showPassword}
                  className="flex-1 ml-3 text-base"
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

            {/* Confirm Password Field */}
            <View className="mb-3">
              <View 
                className="flex-row items-center px-4 py-3 rounded-2xl"
                style={{ backgroundColor: '#E8F3E0' }}
              >
                <Lock size={20} stroke="#6b7280" />
                <TextInput
                  placeholder="Confirm Password"
                  placeholderTextColor="#6b7280"
                  secureTextEntry={!showConfirmPassword}
                  className="flex-1 ml-3 text-base"
                  style={{ color: '#2C4A34', fontFamily: 'System' }}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff size={20} stroke="#6b7280" /> : <Eye size={20} stroke="#6b7280" />}
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
          </View>

          {/* Register Button */}
          <TouchableOpacity 
            className="bg-terracotta py-4 px-8 rounded-3xl items-center mb-6"
            onPress={handleRegister}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white text-lg font-bold uppercase" style={{ fontFamily: 'System' }}>
                SIGN UP
              </Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View className="items-center mb-8">
            <Text className="text-base" style={{ color: '#6b7280', fontFamily: 'System' }}>
              Already have an account?{' '}
              <Link href="/login" asChild>
                <Text className="font-semibold" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                  Log In
                </Text>
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

