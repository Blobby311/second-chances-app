import { Stack } from 'expo-router';
import '../global.css';

export default function RootLayout() {
  // Print API_URL at startup to help debug standalone builds (appears in device logs)
  try {
    // Deliberately not exposing secrets, just the base URL
    // eslint-disable-next-line no-console
    console.log('API_URL', process.env.EXPO_PUBLIC_API_BASE_URL || 'https://second-chances-app.onrender.com');
  } catch (e) {}

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="role-selection" />
      <Stack.Screen 
        name="(seller)" 
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="(buyer)" 
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name="product/[id]" />
      <Stack.Screen name="seller-profile/[id]" />
      <Stack.Screen name="checkout" />
      <Stack.Screen name="rating/[orderId]" />
      {/* Debug screen to surface runtime API URL and token presence */}
      <Stack.Screen name="debug" />
    </Stack>
  );
}

