import { Stack } from 'expo-router';

export default function SellerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="dashboard" 
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
      <Stack.Screen name="create-new" />
      <Stack.Screen name="stock" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="eduhub" />
      <Stack.Screen name="rewards" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="browsing" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="guide/[id]" />
      <Stack.Screen name="edit-stock/[id]" />
      <Stack.Screen name="order-detail/[id]" />
      <Stack.Screen name="ai-chatbot" />
    </Stack>
  );
}

