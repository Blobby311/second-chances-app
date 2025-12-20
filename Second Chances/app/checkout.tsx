import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Alert, Switch, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Star, Gift } from 'lucide-react-native';
import '../global.css';
import { API_URL } from '../config/api';
import { getAuthToken } from '../config/auth';
import { DEMO_ORDERS } from './(buyer)/my-orders';

// TODO: Get from buyer rewards/points API
const USER_POINTS = 345;
const AVAILABLE_REWARDS = [
  { id: 'r1', name: 'Free Delivery', discount: 5, pointsCost: 100 },
  { id: 'r2', name: '10% Discount', discount: 10, pointsCost: 200 },
];

// Map canonical demo seller IDs to their corresponding sample chat IDs
const DEMO_SELLER_CHAT_IDS: Record<string, string> = {
  'demo-seller-1': 'sample-1',
  'demo-seller-2': 'sample-2',
  'demo-seller-3': 'sample-b1',
  'demo-seller-4': 'sample-b2',
};

export default function CheckoutScreen() {
  const { title, price, isFree = 'false', sellerId = 's1', sellerName, id } = useLocalSearchParams<{
    title?: string;
    price?: string;
    isFree?: string;
    sellerId?: string;
    sellerName?: string;
    id?: string;
  }>();
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('GrabPay');
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [selectedReward, setSelectedReward] = useState<string | null>(null);

  const paymentOptions = useMemo(
    () => [
      { id: 'GrabPay', label: 'GrabPay' },
      { id: 'TnG', label: 'TnG eWallet' },
      { id: 'FPX', label: 'Online Banking (FPX)' },
    ],
    []
  );

  const handleConfirm = async () => {
    // TODO: Create order via API and get orderId, deduct points/rewards
    let createdOrderId = `order-${Date.now()}`;

    const isDemoProduct = typeof id === 'string' && id.startsWith('demo-');

    // For demo flows, push a local demo order so it appears under My Orders
    if (isDemoProduct) {
      const demoOrder = {
        id: createdOrderId,
        productName: title ?? 'Rescued Box',
        sellerId: (sellerId as string) || '',
        sellerName: sellerName || 'Demo Seller',
        orderId: createdOrderId,
        deliveryMethod: 'Pickup only',
        total: isCommunityGift ? 'RM0' : (price as string) || 'RM0',
        status: 'To Receive',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRQEytqdym2soe7nH5Tqqe4X1GvyNbDbUs0A&s',
        canRate: false,
        rated: false,
      };

      DEMO_ORDERS.unshift(demoOrder as any);
    } else {
      try {
        if (typeof id !== 'string') {
          Alert.alert('Error', 'Cannot place order: invalid product.');
          return;
        }

        const token = getAuthToken();
        if (!token) {
          Alert.alert('Authentication Required', 'Please log in as a buyer to place an order.');
          return;
        }

        const body: any = {
          productId: id,
          paymentMethod: selectedMethod,
          pointsToUse: usePoints ? pointsToUse : 0,
        };

        const response = await fetch(`${API_URL}/api/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          let errorMessage = 'Failed to create order';
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch (e) {
            errorMessage = `${errorMessage} (${response.status})`;
          }
          Alert.alert('Error', errorMessage);
          return;
        }

        const createdOrder = await response.json();
        createdOrderId = createdOrder.orderId || createdOrder._id || createdOrderId;
      } catch (error: any) {
        console.error('Error creating order:', error);
        Alert.alert('Error', error?.message || 'Failed to create order. Please try again.');
        return;
      }
    }

    Alert.alert('Success', 'Box reserved! You can coordinate pickup with the seller.', [
      {
        text: 'OK',
        onPress: () => {
          // For demo sellers, route to the matching sample chat ID so everything stays in demo mode
          const targetChatId = DEMO_SELLER_CHAT_IDS[sellerId as string] || sellerId;

          router.push({
            pathname: '/chat/[id]',
            params: { id: targetChatId, orderId: createdOrderId, name: sellerName },
          });
        },
      },
    ]);
  };

  const isCommunityGift = isFree === 'true' || price === 'RM0';
  
  // Calculate final price
  const originalPrice = parseFloat(price?.replace('RM', '').trim() || '0');
  let finalPrice = originalPrice;
  
  // Apply reward discount
  if (selectedReward && !isCommunityGift) {
    const reward = AVAILABLE_REWARDS.find(r => r.id === selectedReward);
    if (reward) {
      if (reward.name === 'Free Delivery') {
        finalPrice = Math.max(0, finalPrice - reward.discount);
      } else {
        finalPrice = finalPrice * (1 - reward.discount / 100);
      }
    }
  }
  
  // Apply points discount (1 point = RM0.01)
  if (usePoints && pointsToUse > 0 && !isCommunityGift) {
    const pointsDiscount = pointsToUse * 0.01;
    finalPrice = Math.max(0, finalPrice - pointsDiscount);
  }

  return (
    <View className="flex-1" style={{ backgroundColor: '#365441' }}>
      <StatusBar barStyle="light-content" />

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 64, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-3xl font-bold mb-8" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
          Checkout
        </Text>

        <View
          style={{
            backgroundColor: '#E8F3E0',
            borderRadius: 28,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <Text className="text-lg font-semibold mb-3" style={{ color: '#2C4A34', fontFamily: 'System' }}>
            Order Summary
          </Text>
          <View
            style={{
              backgroundColor: '#F9F1D9',
              borderRadius: 24,
              padding: 16,
              position: 'relative',
            }}
          >
            <Text className="text-base font-semibold mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
              {title ?? 'Rescued Box'}
            </Text>
            <Text className="text-xl font-bold" style={{ color: '#2C4A34', fontFamily: 'System' }}>
              {isCommunityGift ? 'Community Gift' : price ?? 'RM 0.00'}
            </Text>
            {!isCommunityGift && (
              <View
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 14,
                  backgroundColor: '#2C4A34',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                }}
              >
                <Text className="text-xs font-semibold" style={{ color: '#ffffff', fontFamily: 'System' }}>
                  You save 60%!
                </Text>
              </View>
            )}
          </View>
        </View>

        {!isCommunityGift && (
          <View
            style={{
              backgroundColor: '#E8F3E0',
              borderRadius: 28,
              padding: 20,
              marginBottom: 20,
            }}
          >
            <Text className="text-lg font-semibold mb-3" style={{ color: '#2C4A34', fontFamily: 'System' }}>
              Payment Method
            </Text>
            {paymentOptions.map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => setSelectedMethod(method.id)}
                className="flex-row items-center justify-between px-4 py-3 rounded-2xl mb-3"
                style={{
                  backgroundColor: '#ffffff',
                  borderWidth: 1.5,
                  borderColor: selectedMethod === method.id ? '#2C4A34' : '#d9e0d3',
                }}
              >
                <Text
                  className="text-base font-semibold"
                  style={{ color: selectedMethod === method.id ? '#2C4A34' : '#647067', fontFamily: 'System' }}
                >
                  {method.label}
                </Text>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: '#2C4A34',
                    backgroundColor: selectedMethod === method.id ? '#2C4A34' : 'transparent',
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {isCommunityGift && (
          <View
            style={{
              backgroundColor: '#E8F3E0',
              borderRadius: 28,
              padding: 20,
              marginBottom: 20,
            }}
          >
            <Text className="text-lg font-semibold mb-2" style={{ color: '#2C4A34', fontFamily: 'System' }}>
              Community Gift
            </Text>
            <Text className="text-sm" style={{ color: '#2C4A34', fontFamily: 'System' }}>
              No payment needed. Coordinate pickup with your neighbor.
            </Text>
          </View>
        )}

        {/* Rewards & Points Section */}
        {!isCommunityGift && (
          <View
            style={{
              backgroundColor: '#E8F3E0',
              borderRadius: 28,
              padding: 20,
              marginBottom: 20,
            }}
          >
            <Text className="text-lg font-semibold mb-3" style={{ color: '#2C4A34', fontFamily: 'System' }}>
              Rewards & Points
            </Text>
            
            {/* Available Rewards */}
            <Text className="text-sm font-semibold mb-2" style={{ color: '#2C4A34', fontFamily: 'System' }}>
              Use a Reward
            </Text>
            {AVAILABLE_REWARDS.map((reward) => (
              <TouchableOpacity
                key={reward.id}
                onPress={() => setSelectedReward(selectedReward === reward.id ? null : reward.id)}
                className="flex-row items-center justify-between px-4 py-3 rounded-2xl mb-2"
                style={{
                  backgroundColor: '#ffffff',
                  borderWidth: 1.5,
                  borderColor: selectedReward === reward.id ? '#C85E51' : '#d9e0d3',
                }}
              >
                <View className="flex-row items-center flex-1">
                  <Gift size={18} stroke="#C85E51" />
                  <View className="ml-2 flex-1">
                    <Text className="text-sm font-semibold" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                      {reward.name}
                    </Text>
                    <Text className="text-xs" style={{ color: '#6b7280', fontFamily: 'System' }}>
                      {reward.pointsCost} points
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: '#C85E51',
                    backgroundColor: selectedReward === reward.id ? '#C85E51' : 'transparent',
                  }}
                />
              </TouchableOpacity>
            ))}

            {/* Points Toggle */}
            <View className="mt-3 pt-3" style={{ borderTopWidth: 1, borderTopColor: '#d9e0d3' }}>
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center flex-1">
                  <Star size={18} stroke="#facc15" fill="#facc15" />
                  <Text className="text-sm font-semibold ml-2" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                    Use Points ({USER_POINTS} available)
                  </Text>
                </View>
                <Switch
                  value={usePoints}
                  onValueChange={(val) => {
                    setUsePoints(val);
                    if (val) {
                      // Default to using 100 points
                      setPointsToUse(Math.min(100, USER_POINTS, Math.floor(originalPrice * 100)));
                    } else {
                      setPointsToUse(0);
                    }
                  }}
                  trackColor={{ false: '#6b7280', true: '#2C4A34' }}
                  thumbColor="#ffffff"
                />
              </View>
              {usePoints && (
                <Text className="text-xs" style={{ color: '#6b7280', fontFamily: 'System' }}>
                  Using {pointsToUse} points (RM{(pointsToUse * 0.01).toFixed(2)} discount)
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Total Section */}
        <View
          style={{
            backgroundColor: '#E8F3E0',
            borderRadius: 28,
            padding: 20,
            marginBottom: 20,
          }}
        >
          {!isCommunityGift && originalPrice !== finalPrice && (
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm" style={{ color: '#6b7280', fontFamily: 'System' }}>
                Original Price
              </Text>
              <Text className="text-sm line-through" style={{ color: '#6b7280', fontFamily: 'System' }}>
                RM {originalPrice.toFixed(2)}
              </Text>
            </View>
          )}
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-semibold" style={{ color: '#2C4A34', fontFamily: 'System' }}>
              Total to Pay
            </Text>
            <Text className="text-2xl font-bold" style={{ color: '#2C4A34', fontFamily: 'System' }}>
              {isCommunityGift ? 'RM 0.00' : `RM ${finalPrice.toFixed(2)}`}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="py-4 rounded-3xl items-center"
          style={{ backgroundColor: '#C85E51' }}
          onPress={handleConfirm}
        >
          <Text className="text-white text-lg font-bold" style={{ fontFamily: 'System' }}>
            {isCommunityGift ? 'Confirm Claim' : 'Secure Payment'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

