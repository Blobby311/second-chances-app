import { Stack } from 'expo-router';

export default function BuyerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="home" 
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="menu" 
        options={{
          animation: 'slide_from_left',
        }}
      />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="rewards" />
      <Stack.Screen name="map" />
      <Stack.Screen name="favorites" />
      <Stack.Screen name="learn" />
      <Stack.Screen name="addresses" />
      <Stack.Screen name="payments" />
      <Stack.Screen name="referrals" />
      <Stack.Screen name="help" />
      <Stack.Screen name="my-orders" />
      <Stack.Screen name="order-detail/[id]" />
      <Stack.Screen name="ai-chatbot" />
    </Stack>
  );
}

