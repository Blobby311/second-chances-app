import { Stack } from 'expo-router';
import '../global.css';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
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
    </Stack>
  );
}

