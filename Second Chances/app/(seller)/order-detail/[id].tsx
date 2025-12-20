import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Image, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, User } from 'lucide-react-native';
import '../../../global.css';

// TODO: Replace with API call
const getOrderById = (id: string) => {
  const allOrders = [
    {
      id: '1',
      productName: 'Blindbox Veggie Mix',
      orderId: '#XM12345',
      deliveryMethod: 'Doorstep Delivery',
      total: 'RM25.00',
      status: 'To Ship',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRQEytqdym2soe7nH5Tqqe4X1GvyNbDbUs0A&s',
      orderDate: '26 Okt 2024',
      orderTime: '10:30 AM',
      quantity: 1,
      estimatedDelivery: '28 Okt 2024, 2:00 PM - 4:00 PM',
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card (XXXX-1234)',
      buyer: {
        name: 'Ahmad bin Abdullah',
        phone: '+60123456789',
        address: 'No. 123, Jalan Bukit Bintang, 55100 Kuala Lumpur, Wilayah Persekutuan',
        profileId: 'b1',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=60',
      },
    },
    {
      id: '2',
      productName: 'Blindbox Fruit Basket',
      orderId: '#YM67890',
      deliveryMethod: 'Self Pick Up @ Collect Hub',
      total: 'RM12.00',
      status: 'To Ship',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSimGyJxyM2BpGcrcv9_b_lskXGFHA_TPoOw&s',
      orderDate: '25 Okt 2024',
      orderTime: '2:15 PM',
      quantity: 1,
      estimatedDelivery: '27 Okt 2024, 10:00 AM - 12:00 PM',
      paymentStatus: 'Paid',
      paymentMethod: 'GrabPay (XXXX-5678)',
      buyer: {
        name: 'Siti Nurhaliza binti Ahmad',
        phone: '+60198765432',
        address: 'No. 456, Jalan Ampang, 50450 Ampang, Selangor',
        profileId: 'b2',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=60',
      },
    },
    {
      id: '3',
      productName: 'Blindbox Fruit Basket',
      orderId: '#YM67891',
      deliveryMethod: 'Doorstep Delivery',
      total: 'RM15.00',
      status: 'To Ship',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0NTZmv6zIanNf621NF_dJQNoCb4eYQNAAzQ&s',
      orderDate: '24 Okt 2024',
      orderTime: '9:45 AM',
      quantity: 1,
      estimatedDelivery: '26 Okt 2024, 3:00 PM - 5:00 PM',
      paymentStatus: 'Paid',
      paymentMethod: 'TnG eWallet (XXXX-9012)',
      buyer: {
        name: 'Lim Wei Ming',
        phone: '+60162345678',
        address: 'No. 789, Jalan Bukit Bintang, 55100 Kuala Lumpur, Wilayah Persekutuan',
        profileId: 'b3',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=60',
      },
    },
    {
      id: '4',
      productName: 'Blindbox Random Haul',
      orderId: '#ZN11223',
      deliveryMethod: 'Doorstep Delivery',
      total: 'RM18.00',
      status: 'Delivered',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmAps3JJfGUb6r7bvZZL6zHjAzgxvMvD2Ijg&s',
      orderDate: '20 Okt 2024',
      orderTime: '11:20 AM',
      deliveredDate: '22 Okt 2024',
      deliveredTime: '3:30 PM',
      quantity: 1,
      paymentStatus: 'Paid',
      paymentMethod: 'Online Banking (FPX)',
      buyer: {
        name: 'Raj Kumar a/l Muthu',
        phone: '+60134567890',
        address: 'No. 321, Jalan Tun Razak, 50400 Kuala Lumpur, Wilayah Persekutuan',
        profileId: 'b4',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=60',
      },
    },
    {
      id: '5',
      productName: 'Blindbox Veggie Mix',
      orderId: '#XM12346',
      deliveryMethod: 'Self Pick Up @ Farm',
      total: 'RM15.00',
      status: 'Delivered',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRQEytqdym2soe7nH5Tqqe4X1GvyNbDbUs0A&s',
      orderDate: '18 Okt 2024',
      orderTime: '4:00 PM',
      deliveredDate: '20 Okt 2024',
      deliveredTime: '10:15 AM',
      quantity: 1,
      paymentStatus: 'Paid',
      paymentMethod: 'Credit Card (XXXX-3456)',
      buyer: {
        name: 'Fatimah binti Ali',
        phone: '+60178901234',
        address: 'No. 654, Jalan Pahang, 53000 Kuala Lumpur, Wilayah Persekutuan',
        profileId: 'b5',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=60',
      },
    },
    {
      id: '6',
      productName: 'Blindbox Fruit Basket',
      orderId: '#YM67892',
      deliveryMethod: 'Self Pick Up @ Collect Hub',
      total: 'RM12.00',
      status: 'Cancelled',
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSimGyJxyM2BpGcrcv9_b_lskXGFHA_TPoOw&s',
      orderDate: '15 Okt 2024',
      orderTime: '1:30 PM',
      cancelledDate: '16 Okt 2024',
      cancelledTime: '9:00 AM',
      quantity: 1,
      paymentStatus: 'Refunded',
      paymentMethod: 'Credit Card (XXXX-7890)',
      buyer: {
        name: 'Tan Ah Beng',
        phone: '+60145678901',
        address: 'No. 987, Jalan Petaling, 46000 Petaling Jaya, Selangor',
        profileId: 'b6',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=60',
      },
    },
  ];
  return allOrders.find(order => order.id === id) || allOrders[0];
};

// Map dummy buyer profile IDs to sample chat IDs so demo flows use local chats
const DEMO_BUYER_CHAT_IDS: Record<string, string> = {
  b1: 'sample-b1',
  b2: 'sample-b2',
  b3: 'sample-b1',
  b4: 'sample-b2',
  b5: 'sample-b1',
  b6: 'sample-b2',
};

export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useMemo(() => getOrderById(id || ''), [id]);

  if (!order) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: '#365441' }}>
        <Text className="text-base" style={{ color: '#E8F3E0', fontFamily: 'System' }}>Order not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 px-4 py-2 rounded-2xl" style={{ backgroundColor: '#2C4A34' }}>
          <Text className="text-base font-semibold" style={{ color: '#E8F3E0', fontFamily: 'System' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getStatusColor = () => {
    switch (order.status) {
      case 'Delivered':
        return '#2C4A34';
      case 'Cancelled':
        return '#C85E51';
      default:
        return '#C85E51'; // Orange/red for "To Ship"
    }
  };

  const handleMarkAsShipped = () => {
    Alert.alert(
      'Mark as Shipped',
      'Are you sure you want to mark this order as shipped?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            // TODO: Update order status via API
            Alert.alert('Success', 'Order marked as shipped!');
            router.back();
          },
        },
      ]
    );
  };

  const handleCancelOrder = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            // TODO: Cancel order via API
            Alert.alert('Order Cancelled', 'The order has been cancelled and the buyer will be notified.');
            router.back();
          },
        },
      ]
    );
  };

  const handleContactBuyer = () => {
    const profileId = order.buyer.profileId;
    const targetChatId = DEMO_BUYER_CHAT_IDS[profileId] || profileId;
    router.push(`/chat/${encodeURIComponent(targetChatId)}?orderId=${order.id}&name=${encodeURIComponent(order.buyer.name)}`);
  };

  const handleViewProfile = () => {
    router.push(`/buyer-profile/${order.buyer.profileId}`);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#365441' }}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View
        className="flex-row items-center px-4"
        style={{ backgroundColor: '#2C4A34', paddingTop: 60, paddingBottom: 12 }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} stroke="#ffffff" />
        </TouchableOpacity>
        <Text className="text-xl font-bold flex-1 text-center" style={{ color: '#ffffff', fontFamily: 'System' }}>
          Order Details
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Summary */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-base font-semibold" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
              Order ID: {order.orderId}
            </Text>
            <Text className="text-base font-semibold" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
              {order.orderDate}, {order.orderTime}
            </Text>
          </View>
          <View 
            className="px-4 py-2 rounded-full self-start"
            style={{ 
              backgroundColor: getStatusColor(),
            }}
          >
            <Text 
              className="text-sm font-bold" 
              style={{ 
                color: '#E8F3E0',
                fontFamily: 'System',
              }}
            >
              {order.status}
            </Text>
          </View>
        </View>

        {/* Product Details Section */}
        <Text className="text-lg font-bold mb-2" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
          Product Details
        </Text>
        <View 
          className="p-4 rounded-3xl mb-4"
          style={{ 
            backgroundColor: '#E8F3E0',
            borderWidth: 1,
            borderColor: '#2C4A34',
          }}
        >
          <View className="flex-row items-center">
            <View 
              style={{ 
                width: 80, 
                height: 80, 
                borderRadius: 12,
                marginRight: 16,
                overflow: 'hidden',
                backgroundColor: '#FDFBF5',
                borderWidth: 1,
                borderColor: '#2C4A34',
              }}
            >
              <Image
                source={{ uri: order.imageUrl }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
                onError={() => {}}
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                {order.productName}
              </Text>
              <Text className="text-base mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                {order.quantity}x
              </Text>
              <Text className="text-base font-bold" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                {order.total}
              </Text>
            </View>
          </View>
        </View>

        {/* Buyer Information Section */}
        <Text className="text-lg font-bold mb-2" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
          Buyer Information
        </Text>
        <View 
          className="p-4 rounded-3xl mb-4"
          style={{ 
            backgroundColor: '#E8F3E0',
            borderWidth: 1,
            borderColor: '#2C4A34',
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View 
                style={{ 
                  width: 50, 
                  height: 50, 
                  borderRadius: 25,
                  marginRight: 12,
                  overflow: 'hidden',
                  backgroundColor: '#FDFBF5',
                  borderWidth: 1,
                  borderColor: '#2C4A34',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  source={{ uri: order.buyer.avatar }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                  onError={() => {}}
                />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                  {order.buyer.name}
                </Text>
                <Text className="text-sm" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                  {order.buyer.phone}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleViewProfile}
            >
              <Text className="text-sm font-semibold" style={{ color: '#C85E51', fontFamily: 'System' }}>
                View Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Information Section */}
        <Text className="text-lg font-bold mb-2" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
          Delivery Information
        </Text>
        <View 
          className="p-4 rounded-3xl mb-4"
          style={{ 
            backgroundColor: '#E8F3E0',
            borderWidth: 1,
            borderColor: '#2C4A34',
          }}
        >
          <View className="mb-3">
            <View className="flex-row">
              <View style={{ width: 140, flexDirection: 'row', alignItems: 'center' }}>
                <Text className="text-base flex-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                  Method
                </Text>
                <Text className="text-base" style={{ color: '#2C4A34', fontFamily: 'System', marginRight: 8 }}>
                  :
                </Text>
              </View>
              <Text className="text-base flex-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                {order.deliveryMethod}
              </Text>
            </View>
          </View>
          <View className="mb-3">
            <View className="flex-row">
              <View style={{ width: 140, flexDirection: 'row', alignItems: 'center' }}>
                <Text className="text-base flex-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                  Address
                </Text>
                <Text className="text-base" style={{ color: '#2C4A34', fontFamily: 'System', marginRight: 8 }}>
                  :
                </Text>
              </View>
              <Text className="text-base flex-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                {order.buyer.address}
              </Text>
            </View>
          </View>
          {order.estimatedDelivery && (
            <View>
              <View className="flex-row">
                <View style={{ width: 140, flexDirection: 'row', alignItems: 'center' }}>
                  <Text className="text-base flex-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                    Estimated Delivery
                  </Text>
                  <Text className="text-base" style={{ color: '#2C4A34', fontFamily: 'System', marginRight: 8 }}>
                    :
                  </Text>
                </View>
                <Text className="text-base flex-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                  {order.estimatedDelivery}
                </Text>
              </View>
            </View>
          )}
          {order.deliveredDate && (
            <View className="mt-3">
              <View className="flex-row">
                <View style={{ width: 140, flexDirection: 'row', alignItems: 'center' }}>
                  <Text className="text-base flex-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                    Delivered On
                  </Text>
                  <Text className="text-base" style={{ color: '#2C4A34', fontFamily: 'System', marginRight: 8 }}>
                    :
                  </Text>
                </View>
                <Text className="text-base flex-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                  {order.deliveredDate}, {order.deliveredTime}
                </Text>
              </View>
            </View>
          )}
          {order.cancelledDate && (
            <View className="mt-3">
              <View className="flex-row">
                <View style={{ width: 140, flexDirection: 'row', alignItems: 'center' }}>
                  <Text className="text-base flex-1" style={{ color: '#C85E51', fontFamily: 'System' }}>
                    Cancelled On
                  </Text>
                  <Text className="text-base" style={{ color: '#C85E51', fontFamily: 'System', marginRight: 8 }}>
                    :
                  </Text>
                </View>
                <Text className="text-base flex-1" style={{ color: '#C85E51', fontFamily: 'System' }}>
                  {order.cancelledDate}, {order.cancelledTime}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Payment Information Section */}
        <Text className="text-lg font-bold mb-2" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
          Payment Information
        </Text>
        <View 
          className="p-4 rounded-3xl mb-4"
          style={{ 
            backgroundColor: '#E8F3E0',
            borderWidth: 1,
            borderColor: '#2C4A34',
          }}
        >
          <View className="mb-3">
            <View className="flex-row">
              <View style={{ width: 140, flexDirection: 'row', alignItems: 'center' }}>
                <Text className="text-base flex-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                  Total
                </Text>
                <Text className="text-base" style={{ color: '#2C4A34', fontFamily: 'System', marginRight: 8 }}>
                  :
                </Text>
              </View>
              <Text className="text-base flex-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                {order.total}
              </Text>
            </View>
          </View>
          <View className="mb-3">
            <View className="flex-row">
              <View style={{ width: 140, flexDirection: 'row', alignItems: 'center' }}>
                <Text className="text-base flex-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                  Method
                </Text>
                <Text className="text-base" style={{ color: '#2C4A34', fontFamily: 'System', marginRight: 8 }}>
                  :
                </Text>
              </View>
              <Text className="text-base flex-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                {order.paymentMethod}
              </Text>
            </View>
          </View>
          <View>
            <View className="flex-row">
              <View style={{ width: 140, flexDirection: 'row', alignItems: 'center' }}>
                <Text className="text-base flex-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                  Status
                </Text>
                <Text className="text-base" style={{ color: '#2C4A34', fontFamily: 'System', marginRight: 8 }}>
                  :
                </Text>
              </View>
              <Text className="text-base flex-1" style={{ color: order.paymentStatus === 'Paid' ? '#2C4A34' : '#C85E51', fontFamily: 'System' }}>
                {order.paymentStatus}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {order.status === 'To Ship' && (
        <View 
          className="px-4 pb-8 pt-4 absolute bottom-0 left-0 right-0"
          style={{ backgroundColor: '#365441', borderTopWidth: 1, borderTopColor: '#2C4A34' }}
        >
          {/* Mark as Shipped - Full width */}
          <TouchableOpacity
            className="py-4 rounded-3xl items-center mb-3"
            style={{ backgroundColor: '#C85E51' }}
            onPress={handleMarkAsShipped}
          >
            <Text className="text-lg font-bold" style={{ color: '#ffffff', fontFamily: 'System' }}>
              Mark as Shipped
            </Text>
          </TouchableOpacity>

          {/* Contact Buyer and Cancel Order - Side by side */}
          <View className="flex-row" style={{ gap: 12 }}>
            <TouchableOpacity
              className="flex-1 py-4 rounded-3xl items-center"
              style={{ backgroundColor: '#2C4A34' }}
              onPress={handleContactBuyer}
            >
              <Text className="text-base font-bold" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                Contact Buyer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 py-4 rounded-3xl items-center"
              style={{ backgroundColor: '#E8F3E0', borderWidth: 1, borderColor: '#C85E51' }}
              onPress={handleCancelOrder}
            >
              <Text className="text-base font-semibold" style={{ color: '#C85E51', fontFamily: 'System' }}>
                Cancel Order
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* For Delivered/Cancelled orders, only show Contact Buyer */}
      {(order.status === 'Delivered' || order.status === 'Cancelled') && (
        <View 
          className="px-4 pb-8 pt-4 absolute bottom-0 left-0 right-0"
          style={{ backgroundColor: '#365441', borderTopWidth: 1, borderTopColor: '#2C4A34' }}
        >
          <TouchableOpacity
            className="py-4 rounded-3xl items-center"
            style={{ backgroundColor: '#2C4A34' }}
            onPress={handleContactBuyer}
          >
            <Text className="text-lg font-bold" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
              Contact Buyer
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
