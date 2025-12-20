import React, { useEffect, useState } from 'react';
import { View, Text, Button, Clipboard, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import '../global.css';
import { API_URL } from '../config/api';
import { loadAuthToken, getAuthToken } from '../config/auth';

export default function DebugScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('Not tested');
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    (async () => {
      await loadAuthToken();
      setToken(getAuthToken());
    })();
  }, []);

  const testConnection = async () => {
    setTesting(true);
    setConnectionStatus('Testing...');
    try {
      const response = await fetch(`${API_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setConnectionStatus(`✅ Connected! Status: ${data.status || 'OK'}`);
      } else {
        setConnectionStatus(`❌ Failed: HTTP ${response.status}`);
      }
    } catch (error: any) {
      setConnectionStatus(`❌ Error: ${error.message || 'Network request failed'}`);
    } finally {
      setTesting(false);
    }
  };

  const copyInfo = async () => {
    const info = `API_URL=${API_URL}\nhasToken=${!!token}\nConnection: ${connectionStatus}`;
    if (Platform.OS === 'web') {
      // Fallback for web
      await navigator.clipboard.writeText(info);
      Alert.alert('Copied', 'Debug info copied to clipboard');
    } else {
      try {
        // legacy Clipboard from react-native
        await Clipboard.setString(info as any);
        Alert.alert('Copied', 'Debug info copied to clipboard');
      } catch (e) {
        Alert.alert('Copy failed', info);
      }
    }
  };

  return (
    <SafeAreaView className="p-4">
      <View className="mb-4">
        <Text className="text-lg font-bold">Debug</Text>
      </View>

      <View className="mb-4">
        <Text className="text-sm font-semibold">API URL</Text>
        <Text className="text-base">{API_URL}</Text>
      </View>

      <View className="mb-4">
        <Text className="text-sm font-semibold">Auth Token Present</Text>
        <Text className="text-base">{token ? 'Yes' : 'No'}</Text>
        {token && <Text className="text-xs mt-1">Token (head): {token.slice(0, 8)}…</Text>}
      </View>

      <View className="mb-4">
        <Text className="text-sm font-semibold">Backend Connection</Text>
        <Text className="text-base">{connectionStatus}</Text>
      </View>

      <View className="mb-4">
        <Button 
          title={testing ? "Testing..." : "Test Connection"} 
          onPress={testConnection}
          disabled={testing}
        />
      </View>

      <View>
        <Button title="Copy debug info" onPress={copyInfo} />
      </View>
    </SafeAreaView>
  );
}
