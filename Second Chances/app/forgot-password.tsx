import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, ArrowLeft } from 'lucide-react-native';
import '../global.css';
import { API_URL } from '../config/api';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');

  const handleRequestReset = async () => {
    setError('');
    
    if (!email || !email.trim()) {
      setError('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || 'Failed to request password reset');
        return;
      }

      // For now, show the token (in production, this would be sent via email)
      if (data.resetToken) {
        setResetToken(data.resetToken);
        setSuccess(true);
        setStep('reset');
        Alert.alert(
          'Reset Token Generated',
          `Your reset token is: ${data.resetToken}\n\nPlease enter it below along with your new password.`,
          [{ text: 'OK' }]
        );
      } else {
        setSuccess(true);
        Alert.alert(
          'Check Your Email',
          'If that email exists, password reset instructions have been sent.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    } catch (err: any) {
      setError('Unable to reach server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError('');

    if (!resetToken || !resetToken.trim()) {
      setError('Reset token is required');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          resetToken: resetToken.trim(),
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || 'Failed to reset password');
        return;
      }

      Alert.alert(
        'Success',
        'Your password has been reset successfully. Please login with your new password.',
        [{ text: 'OK', onPress: () => router.replace('/login') }]
      );
    } catch (err: any) {
      setError('Unable to reach server. Please try again.');
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
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft size={24} stroke="#E8F3E0" />
          </TouchableOpacity>

          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-4xl font-bold mb-2 text-center" style={{ color: '#cee4b0', fontFamily: 'System' }}>
              {step === 'request' ? 'Forgot Password' : 'Reset Password'}
            </Text>
            <Text className="text-base text-center" style={{ color: '#cee4b0', fontFamily: 'System' }}>
              {step === 'request' 
                ? 'Enter your email to receive a password reset token'
                : 'Enter your reset token and new password'}
            </Text>
          </View>

          {step === 'request' ? (
            <>
              {/* Email Field */}
              <View className="mb-6">
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
                    editable={!loading}
                  />
                </View>
              </View>

              {error ? (
                <View className="mb-3">
                  <Text className="text-sm" style={{ color: '#C85E51', fontFamily: 'System' }}>
                    {error}
                  </Text>
                </View>
              ) : null}

              {/* Request Reset Button */}
              <TouchableOpacity 
                className="bg-terracotta py-4 px-8 rounded-3xl items-center mb-6"
                onPress={handleRequestReset}
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-white text-lg font-bold uppercase" style={{ fontFamily: 'System' }}>
                    Send Reset Token
                  </Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Reset Token Field */}
              <View className="mb-4">
                <View 
                  className="flex-row items-center px-4 py-3 rounded-2xl"
                  style={{ backgroundColor: '#E8F3E0' }}
                >
                  <TextInput
                    placeholder="Reset Token"
                    placeholderTextColor="#6b7280"
                    className="flex-1 text-base"
                    style={{ color: '#2C4A34', fontFamily: 'System' }}
                    value={resetToken}
                    onChangeText={setResetToken}
                    autoCapitalize="none"
                    editable={!loading}
                  />
                </View>
              </View>

              {/* New Password Field */}
              <View className="mb-4">
                <View 
                  className="flex-row items-center px-4 py-3 rounded-2xl"
                  style={{ backgroundColor: '#E8F3E0' }}
                >
                  <TextInput
                    placeholder="New Password"
                    placeholderTextColor="#6b7280"
                    secureTextEntry
                    className="flex-1 text-base"
                    style={{ color: '#2C4A34', fontFamily: 'System' }}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    autoCapitalize="none"
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Confirm Password Field */}
              <View className="mb-3">
                <View 
                  className="flex-row items-center px-4 py-3 rounded-2xl"
                  style={{ backgroundColor: '#E8F3E0' }}
                >
                  <TextInput
                    placeholder="Confirm New Password"
                    placeholderTextColor="#6b7280"
                    secureTextEntry
                    className="flex-1 text-base"
                    style={{ color: '#2C4A34', fontFamily: 'System' }}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    autoCapitalize="none"
                    editable={!loading}
                  />
                </View>
              </View>

              {error ? (
                <View className="mb-3">
                  <Text className="text-sm" style={{ color: '#C85E51', fontFamily: 'System' }}>
                    {error}
                  </Text>
                </View>
              ) : null}

              {/* Reset Password Button */}
              <TouchableOpacity 
                className="bg-terracotta py-4 px-8 rounded-3xl items-center mb-6"
                onPress={handleResetPassword}
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-white text-lg font-bold uppercase" style={{ fontFamily: 'System' }}>
                    Reset Password
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* Back to Login */}
          <View className="items-center mb-8">
            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text className="text-base" style={{ color: '#6b7280', fontFamily: 'System' }}>
                Back to Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

