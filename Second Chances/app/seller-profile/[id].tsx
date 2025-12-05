import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Image, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ShieldCheck, MessageCircle, Package, Star, Heart } from 'lucide-react-native';
import '../../global.css';

// Badge image mapping
const BADGE_IMAGES: { [key: string]: any } = {
  'giver.png': require('../../assets/badges/giver.png'),
  'hero.png': require('../../assets/badges/hero.png'),
  'eco-hero.png': require('../../assets/badges/eco-hero.png'),
  'trusted.png': require('../../assets/badges/trusted.png'),
  'weekly.png': require('../../assets/badges/weekly.png'),
};

// TODO: Replace with API call
const SELLER_DATA = [
  {
    id: 's1',
    name: 'Uncle Roger',
    sellerType: 'Community Seller',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa3du6j726GP7-rDxHda8-FYopWptm3LsTWA&s',
    verified: true,
    stats: {
      boxesShared: '50+ Boxes',
      rating: '4.9 Rating',
      replyRate: '100% Reply',
    },
    badges: [
      { id: 'giver', icon: 'giver.png' },
      { id: 'hero', icon: 'eco-hero.png' },
    ],
    reviews: [
      {
        id: 'r1',
        buyerName: 'Ahmad bin Abdullah',
        buyerHandle: '@ahmad',
        timeAgo: '1 week ago',
        rating: 5,
        reviewText: 'Great seller! Fresh produce and very friendly. Highly recommend!',
      },
      {
        id: 'r2',
        buyerName: 'Siti Nurhaliza',
        buyerHandle: '@siti',
        timeAgo: '2 weeks ago',
        rating: 5,
        reviewText: 'Very reliable seller. Always has good quality boxes. Great service!',
      },
      {
        id: 'r3',
        buyerName: 'Lim Wei Ming',
        buyerHandle: '@limwm',
        timeAgo: '3 weeks ago',
        rating: 4,
        reviewText: 'Good seller, fresh vegetables and fruits.',
      },
    ],
  },
  {
    id: 's2',
    name: 'Kak Siti',
    sellerType: 'Community Seller',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=60',
    verified: true,
    stats: {
      boxesShared: '35+ Boxes',
      rating: '4.8 Rating',
      replyRate: '98% Reply',
    },
    badges: [
      { id: 'giver', icon: 'giver.png' },
      { id: 'trusted', icon: 'trusted.png' },
    ],
    reviews: [
      {
        id: 'r1',
        buyerName: 'Ahmad bin Abdullah',
        buyerHandle: '@ahmad',
        timeAgo: '1 week ago',
        rating: 5,
        reviewText: 'Excellent seller! Very punctual and friendly.',
      },
    ],
  },
];

export default function SellerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const seller = useMemo(() => SELLER_DATA.find((item) => item.id === id) ?? SELLER_DATA[0], [id]);

  const STAT_ICONS = [
    { id: 'boxes', label: seller.stats.boxesShared, icon: Package },
    { id: 'rating', label: seller.stats.rating, icon: Star },
    { id: 'reply', label: seller.stats.replyRate, icon: Heart },
  ];

  const getBadgeImage = (badgeIcon: string | null) => {
    if (!badgeIcon) return null;
    return BADGE_IMAGES[badgeIcon] || null;
  };

  const renderReview = ({ item }: { item: typeof seller.reviews[0] }) => (
    <View
      className="p-4 rounded-3xl mb-3"
      style={{
        backgroundColor: '#E8F3E0',
        borderWidth: 1,
        borderColor: '#2C4A34',
      }}
    >
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1">
          <Text className="text-base font-bold mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
            {item.buyerName}
          </Text>
          <Text className="text-sm mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
            {item.buyerHandle}
          </Text>
          <Text className="text-xs mb-2" style={{ color: '#6b7280', fontFamily: 'System' }}>
            {item.timeAgo}
          </Text>
        </View>
        <View className="flex-row">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              size={16}
              stroke="#fbbf24"
              fill={idx < item.rating ? '#fbbf24' : 'none'}
            />
          ))}
        </View>
      </View>
      <Text className="text-sm" style={{ color: '#2C4A34', fontFamily: 'System' }}>
        {item.reviewText}
      </Text>
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: '#365441' }}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View
        className="flex-row items-center px-4"
        style={{ backgroundColor: '#2C4A34', paddingTop: 60, paddingBottom: 16 }}
      >
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} stroke="#ffffff" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-bold text-center" style={{ color: '#ffffff', fontFamily: 'System' }}>
            Seller Profile
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Profile Header */}
        <View className="items-center mt-6 mb-6">
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              overflow: 'hidden',
              marginBottom: 16,
              borderWidth: 3,
              borderColor: '#E8F3E0',
            }}
          >
            <Image
              source={{ uri: seller.avatar }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </View>
          
          <Text className="text-2xl font-bold mb-2" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            {seller.name}
          </Text>
          
          <Text className="text-base mb-4" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            {seller.sellerType}
          </Text>

          {/* Badges */}
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <View
              className="px-4 py-2 rounded-full"
              style={{ backgroundColor: '#E8F3E0' }}
            >
              <Text className="text-sm font-semibold" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                Second Chances Seller
              </Text>
            </View>
            {seller.verified && (
              <View
                className="flex-row items-center px-4 py-2 rounded-full"
                style={{ backgroundColor: '#E8F3E0' }}
              >
                <ShieldCheck size={16} stroke="#2C4A34" />
                <Text className="text-sm font-semibold ml-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                  Verified Seller
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Seller Statistics */}
        <View className="flex-row px-4 mb-6" style={{ gap: 12 }}>
          {STAT_ICONS.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <View
                key={stat.id}
                className="flex-1 p-4 rounded-3xl items-center"
                style={{
                  backgroundColor: '#E8F3E0',
                  borderWidth: 1,
                  borderColor: '#2C4A34',
                }}
              >
                <IconComponent size={24} stroke="#2C4A34" strokeWidth={2} />
                <Text className="text-sm font-bold mt-2 text-center" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                  {stat.label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Badges Section */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold mb-3" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            Badges
          </Text>
          <View className="flex-row" style={{ gap: 12 }}>
            {seller.badges.map((badge) => {
              const badgeImage = getBadgeImage(badge.icon);
              return (
                <View
                  key={badge.id}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    backgroundColor: '#E8F3E0',
                    borderWidth: badgeImage ? 3 : 2,
                    borderColor: badgeImage ? '#2C4A34' : '#6b7280',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  {badgeImage ? (
                    <Image
                      source={badgeImage}
                      style={{ width: 70, height: 70 }}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: '#d1d5db',
                      }}
                    />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Buyer Reviews Section */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold mb-3" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            Buyer Reviews
          </Text>
          <FlatList
            data={seller.reviews}
            renderItem={renderReview}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/* Bottom Chat Button */}
      <View
        className="absolute bottom-0 left-0 right-0 px-4 py-4"
        style={{ backgroundColor: '#365441' }}
      >
        <TouchableOpacity
          className="py-4 rounded-3xl flex-row items-center justify-center"
          style={{ backgroundColor: '#C85E51' }}
          onPress={() => router.push(`/chat/${seller.id}`)}
        >
          <MessageCircle size={20} stroke="#ffffff" />
          <Text className="text-white text-lg font-bold ml-2" style={{ fontFamily: 'System' }}>
            Chat with {seller.name.split(' ')[0]}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
