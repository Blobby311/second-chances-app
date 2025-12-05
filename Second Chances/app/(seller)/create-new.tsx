import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, Image, PanResponder, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, DoorOpen, Users, ShoppingCart, Image as ImageIcon } from 'lucide-react-native';
import '../../global.css';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CreateNewScreen() {
  const router = useRouter();
  const [blindboxName, setBlindboxName] = useState('');
  const [blindboxImage, setBlindboxImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Fruits');
  const [selectedPrice, setSelectedPrice] = useState('Free');
  const [customPrice, setCustomPrice] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState<string | null>(null);
  // PanResponder for swipe-to-open menu
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dx > 0 && evt.nativeEvent.pageX < 50;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > SCREEN_WIDTH * 0.3) {
          router.push('/(seller)/menu');
        }
      },
    })
  ).current;

  const categories = ['Fruits', 'Vegetable', 'Mix'];
  const prices = ['Free', 'RM5', 'RM10', 'Custom'];
  const deliveryMethods = [
    { id: 'doorstep', label: 'Doorstep Delivery', icon: DoorOpen },
    { id: 'hub', label: 'Hub Collect', icon: Users },
    { id: 'pickup', label: 'Self Pick-Up', icon: ShoppingCart },
  ];

  return (
    <View className="flex-1" style={{ backgroundColor: '#365441' }}>
      <StatusBar barStyle="light-content" />
      
          {/* Header */}
          <View
            className="flex-row items-center justify-between px-4"
            style={{ backgroundColor: '#2C4A34', paddingTop: 60, paddingBottom: 12 }}
          >
            <TouchableOpacity onPress={() => router.push('/(seller)/menu')}>
              <Menu size={24} stroke="#ffffff" />
            </TouchableOpacity>
            <Text className="text-xl font-bold" style={{ color: '#ffffff', fontFamily: 'System' }}>
              Create a BlindBox!
            </Text>
            <View style={{ width: 24 }} />
          </View>

      <View
        style={{ flex: 1 }}
        {...panResponder.panHandlers}
      >
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        >
        {/* Image Input Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            Blindbox Image
          </Text>
          
          <TouchableOpacity
            className="items-center justify-center rounded-3xl"
            style={{ 
              backgroundColor: '#E8F3E0',
              borderWidth: 1,
              borderColor: '#2C4A34',
              minHeight: 200,
              borderStyle: blindboxImage ? 'solid' : 'dashed',
            }}
            onPress={() => {
              // TODO: Handle image picker
              console.log('Open image picker');
            }}
          >
            {blindboxImage ? (
              <Image 
                source={{ uri: blindboxImage }} 
                style={{ width: '100%', height: 200, borderRadius: 24 }}
                resizeMode="cover"
              />
            ) : (
              <View className="items-center">
                <ImageIcon size={48} stroke="#2C4A34" style={{ marginBottom: 8 }} />
                <Text className="text-base" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                  Tap to add image
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Name Input Section */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            Blindbox Name
          </Text>
          
          <TextInput
            placeholder="e.g. Mixed Veggies"
            placeholderTextColor="#6b7280"
            className="px-4 py-4 rounded-3xl text-base"
            style={{ 
              backgroundColor: '#E8F3E0',
              borderWidth: 1,
              borderColor: '#2C4A34',
              color: '#2C4A34',
              fontFamily: 'System',
            }}
            value={blindboxName}
            onChangeText={setBlindboxName}
          />
        </View>

        {/* BlindBox Details */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            Blindbox Details
          </Text>
          
          <TextInput
            placeholder="Add description..."
            placeholderTextColor="#6b7280"
            className="px-4 py-4 rounded-3xl text-base"
            style={{ 
              backgroundColor: '#E8F3E0',
              borderWidth: 1,
              borderColor: '#2C4A34',
              color: '#2C4A34',
              fontFamily: 'System',
              minHeight: 100,
            }}
            multiline
          />
        </View>

        {/* Category */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            Category
          </Text>
          
          <View className="flex-row">
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                className="flex-1 items-center justify-center py-3 rounded-3xl mr-2"
                style={{ 
                  backgroundColor: selectedCategory === category ? '#E8F3E0' : '#2C4A34',
                  borderWidth: selectedCategory === category ? 0 : 1,
                  borderColor: '#E8F3E0',
                  minHeight: 60,
                }}
              >
                <Text 
                  className="text-base font-semibold text-center" 
                  style={{ 
                    color: selectedCategory === category ? '#2C4A34' : '#E8F3E0',
                    fontFamily: 'System',
                  }}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Price */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            Price
          </Text>
          
          <View className="flex-row mb-3">
            {prices.map((price, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedPrice(price)}
                className="flex-1 items-center justify-center py-3 rounded-3xl mr-2"
                style={{ 
                  backgroundColor: selectedPrice === price ? '#E8F3E0' : '#2C4A34',
                  borderWidth: selectedPrice === price ? 0 : 1,
                  borderColor: '#E8F3E0',
                  minHeight: 60,
                }}
              >
                <Text 
                  className="text-base font-semibold text-center" 
                  style={{ 
                    color: selectedPrice === price ? '#2C4A34' : '#E8F3E0',
                    fontFamily: 'System',
                  }}
                >
                  {price}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Price Input */}
          {selectedPrice === 'Custom' && (
            <View className="flex-row items-center">
              <Text className="text-base font-semibold mr-2" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                RM
              </Text>
              <TextInput
                placeholder="Enter amount"
                placeholderTextColor="#6b7280"
                keyboardType="numeric"
                className="flex-1 px-4 py-4 rounded-3xl text-base"
                style={{ 
                  backgroundColor: '#E8F3E0',
                  borderWidth: 1,
                  borderColor: '#2C4A34',
                  color: '#2C4A34',
                  fontFamily: 'System',
                }}
                value={customPrice}
                onChangeText={setCustomPrice}
              />
            </View>
          )}
        </View>

        {/* Delivery Method */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            Delivery Method
          </Text>
          
          <View className="flex-row justify-between">
            {deliveryMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => setSelectedDelivery(method.id)}
                  className="flex-1 items-center mx-1"
                >
                  <View 
                    className="items-center justify-center rounded-3xl mb-2"
                    style={{ 
                      width: '100%',
                      minHeight: 60,
                      backgroundColor: selectedDelivery === method.id ? '#E8F3E0' : '#2C4A34',
                      borderWidth: selectedDelivery === method.id ? 0 : 1,
                      borderColor: '#E8F3E0',
                    }}
                  >
                    <IconComponent 
                      size={24} 
                      stroke={selectedDelivery === method.id ? '#2C4A34' : '#E8F3E0'} 
                    />
                  </View>
                  <Text 
                    className="text-sm text-center font-semibold mt-2" 
                    style={{ 
                      color: '#E8F3E0',
                      fontFamily: 'System',
                    }}
                  >
                    {method.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        </ScrollView>
      </View>

      {/* GENERATE Button */}
      <View className="px-4 pb-8 pt-4" style={{ backgroundColor: '#365441' }}>
        <TouchableOpacity 
          className="py-4 rounded-3xl items-center"
          style={{ backgroundColor: '#C85E51' }}
          onPress={() => {
            // TODO: Handle generate action
            console.log('Generate BlindBox');
          }}
        >
          <Text className="text-white text-lg font-bold uppercase" style={{ fontFamily: 'System' }}>
            GENERATE
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

