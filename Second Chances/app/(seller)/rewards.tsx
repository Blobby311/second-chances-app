import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar, ScrollView, Image, PanResponder, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu } from 'lucide-react-native';
import '../../global.css';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Badge image mapping - static requires for React Native
const BADGE_IMAGES: { [key: string]: any } = {
  'giver.png': require('../../assets/badges/giver.png'),
  'hero.png': require('../../assets/badges/hero.png'),
  'early-bird.png': require('../../assets/badges/early-bird.png'),
  'champion.png': require('../../assets/badges/champion.png'),
  'fast.png': require('../../assets/badges/fast.png'),
  'eco-warrior.png': require('../../assets/badges/eco-warrior.png'),
  'trusted.png': require('../../assets/badges/trusted.png'),
  'weekly.png': require('../../assets/badges/weekly.png'),
};

// TODO: Replace with API call
const SELLER_BADGES = [
  {
    id: 'giver',
    name: 'Giver',
    description: 'Shared 10+ boxes',
    image: 'giver.png',
    isEarned: true,
    requirement: '10+ boxes shared',
    currentProgress: 10,
    requiredProgress: 10,
  },
  {
    id: 'hero',
    name: 'Hero',
    description: 'Maintained 4.5+ rating',
    image: 'hero.png',
    isEarned: true,
    requirement: '4.5+ rating maintained',
    currentProgress: 4.8,
    requiredProgress: 4.5,
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'First 10 orders completed',
    image: 'early-bird.png',
    isEarned: true,
    requirement: 'First 10 orders',
    currentProgress: 10,
    requiredProgress: 10,
  },
  {
    id: 'champion',
    name: 'Community Champion',
    description: '50+ boxes shared',
    image: 'champion.png',
    isEarned: false,
    requirement: '50+ boxes shared',
    isPrestige: true,
    currentProgress: 32,
    requiredProgress: 50,
  },
  {
    id: 'fast-responder',
    name: 'Fast Responder',
    description: '100% reply rate',
    image: 'fast.png',
    isEarned: false,
    requirement: '100% reply rate',
    currentProgress: 85,
    requiredProgress: 100,
  },
  {
    id: 'eco-warrior',
    name: 'Eco Warrior',
    description: '100+ boxes saved from waste',
    image: 'eco-warrior.png',
    isEarned: false,
    requirement: '100+ boxes saved',
    currentProgress: 67,
    requiredProgress: 100,
  },
  {
    id: 'trusted',
    name: 'Trusted Seller',
    description: '5-star average with 20+ reviews',
    image: 'trusted.png',
    isEarned: true,
    requirement: '5-star, 20+ reviews',
    currentProgress: 20,
    requiredProgress: 20,
  },
  {
    id: 'weekly-warrior',
    name: 'Weekly Warrior',
    description: 'Active 7 days in a row',
    image: 'weekly.png',
    isEarned: false,
    requirement: '7 days active streak',
    currentProgress: 4,
    requiredProgress: 7,
  },
];

export default function RewardsScreen() {
  const router = useRouter();
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

  const renderBadge = ({ item }: { item: typeof SELLER_BADGES[0] }) => {
    const badgeImage = item.image ? BADGE_IMAGES[item.image] : null;
    const borderWidth = item.isPrestige ? 4 : 3;
    
    return (
      <View
        className="items-center justify-center p-4 rounded-3xl mb-4"
        style={{
          backgroundColor: '#E8F3E0',
          borderWidth: item.isEarned ? borderWidth : 1,
          borderColor: item.isEarned ? '#2C4A34' : '#6b7280',
          minHeight: 160,
          width: '48%',
          opacity: item.isEarned ? 1 : 0.6,
        }}
      >
        {/* Badge Image in Circle */}
        {badgeImage ? (
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: borderWidth,
              borderColor: item.isEarned ? '#2C4A34' : '#6b7280',
              marginBottom: 12,
              overflow: 'hidden',
              backgroundColor: '#E8F3E0',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              source={badgeImage}
              style={{
                width: 120,
                height: 120,
                opacity: item.isEarned ? 1 : 0.5,
              }}
              resizeMode="contain"
            />
          </View>
        ) : null}
        
        <Text
          className="text-base font-bold text-center mb-1"
          style={{
            color: item.isEarned ? '#2C4A34' : '#6b7280',
            fontFamily: 'System',
          }}
        >
          {item.name}
        </Text>
        <Text
          className="text-xs text-center mb-2"
          style={{
            color: item.isEarned ? '#2C4A34' : '#6b7280',
            fontFamily: 'System',
          }}
        >
          {item.description}
        </Text>
        {!item.isEarned && (
          <>
            {/* Progress Bar */}
            <View
              style={{
                width: '100%',
                height: 6,
                backgroundColor: '#d1d5db',
                borderRadius: 3,
                overflow: 'hidden',
                marginBottom: 4,
              }}
            >
              <View
                style={{
                  width: `${Math.min((item.currentProgress / item.requiredProgress) * 100, 100)}%`,
                  height: '100%',
                  backgroundColor: '#C85E51',
                  borderRadius: 3,
                }}
              />
            </View>
            <Text
              className="text-xs text-center"
              style={{
                color: '#6b7280',
                fontFamily: 'System',
              }}
            >
              {item.currentProgress} / {item.requiredProgress}
            </Text>
          </>
        )}
      </View>
    );
  };

  const earnedCount = SELLER_BADGES.filter(badge => badge.isEarned).length;
  const totalCount = SELLER_BADGES.length;

  return (
    <View className="flex-1" style={{ backgroundColor: '#365441' }}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View 
        className="px-4"
        style={{ backgroundColor: '#2C4A34', paddingTop: 60, paddingBottom: 16 }}
      >
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.push('/(seller)/menu')} className="mr-3">
            <Menu size={24} stroke="#ffffff" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold" style={{ color: '#ffffff', fontFamily: 'System' }}>
              Achievements & Badges
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Section */}
      <View 
        className="px-4 py-4"
        style={{ backgroundColor: '#365441' }}
      >
        <View 
          className="p-4 rounded-3xl"
          style={{ 
            backgroundColor: '#E8F3E0',
            borderWidth: 1,
            borderColor: '#2C4A34',
          }}
        >
          <Text className="text-lg font-bold mb-2" style={{ color: '#2C4A34', fontFamily: 'System' }}>
            Your Progress
          </Text>
          <Text className="text-3xl font-bold mb-1" style={{ color: '#C85E51', fontFamily: 'System' }}>
            {earnedCount} / {totalCount}
          </Text>
          <Text className="text-sm" style={{ color: '#2C4A34', fontFamily: 'System' }}>
            Badges Earned
          </Text>
        </View>
      </View>

      {/* Badges Grid */}
      <View
        style={{ flex: 1 }}
        {...panResponder.panHandlers}
      >
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        >
        <Text className="text-lg font-bold mb-4" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
          All Badges
        </Text>
        <FlatList
          data={SELLER_BADGES}
          renderItem={renderBadge}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          scrollEnabled={false}
        />
        </ScrollView>
      </View>

    </View>
  );
}
