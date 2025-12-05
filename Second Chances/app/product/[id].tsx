import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground, FlatList, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ShieldCheck, Leaf, Star, Heart } from 'lucide-react-native';
import '../../global.css';

// TODO: Replace with API call - Should match seller's stock items
const PRODUCT_DETAILS = [
  {
    id: '1',
    title: 'Rescued Veggie Box',
    price: 'RM10',
    isFree: false,
    isVerified: true,
    heroImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRQEytqdym2soe7nH5Tqqe4X1GvyNbDbUs0A&s',
    imperfectLevel: 60,
    seller: {
      id: 's1',
      name: 'Uncle Roger',
      rating: 4.9,
      boxesShared: 50,
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa3du6j726GP7-rDxHda8-FYopWptm3LsTWA&s',
      verified: true,
      badges: [
        { id: 'giver', label: 'Community Giver', icon: 'heart' },
        { id: 'hero', label: 'Eco Hero', icon: 'star' },
      ],
    },
    likelyContents: [
      { id: 'c1', label: 'Carrots', percent: 90 },
      { id: 'c2', label: 'Tomatoes', percent: 60 },
      { id: 'c3', label: 'Leafy Greens', percent: 70 },
    ],
  },
  {
    id: '2',
    title: 'Sunrise Fruit Crate',
    price: 'RM15',
    isFree: false,
    isVerified: true,
    heroImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSimGyJxyM2BpGcrcv9_b_lskXGFHA_TPoOw&s',
    imperfectLevel: 45,
    seller: {
      id: 's1',
      name: 'Uncle Roger',
      rating: 4.9,
      boxesShared: 50,
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa3du6j726GP7-rDxHda8-FYopWptm3LsTWA&s',
      verified: true,
      badges: [
        { id: 'giver', label: 'Community Giver', icon: 'heart' },
        { id: 'hero', label: 'Eco Hero', icon: 'star' },
      ],
    },
    likelyContents: [
      { id: 'c1', label: 'Apples', percent: 85 },
      { id: 'c2', label: 'Oranges', percent: 75 },
      { id: 'c3', label: 'Bananas', percent: 80 },
    ],
  },
  {
    id: '3',
    title: 'Organic Veg Rescue',
    price: 'RM12',
    isFree: false,
    isVerified: true,
    heroImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0NTZmv6zIanNf621NF_dJQNoCb4eYQNAAzQ&s',
    imperfectLevel: 55,
    seller: {
      id: 's1',
      name: 'Uncle Roger',
      rating: 4.9,
      boxesShared: 50,
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa3du6j726GP7-rDxHda8-FYopWptm3LsTWA&s',
      verified: true,
      badges: [
        { id: 'giver', label: 'Community Giver', icon: 'heart' },
        { id: 'hero', label: 'Eco Hero', icon: 'star' },
      ],
    },
    likelyContents: [
      { id: 'c1', label: 'Broccoli', percent: 80 },
      { id: 'c2', label: 'Cauliflower', percent: 70 },
      { id: 'c3', label: 'Peppers', percent: 65 },
    ],
  },
  {
    id: '4',
    title: 'Neighbor\'s Free Gift',
    price: 'RM0',
    isFree: true,
    isVerified: true,
    heroImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmAps3JJfGUb6r7bvZZL6zHjAzgxvMvD2Ijg&s',
    imperfectLevel: 70,
    seller: {
      id: 's1',
      name: 'Uncle Roger',
      rating: 4.9,
      boxesShared: 50,
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa3du6j726GP7-rDxHda8-FYopWptm3LsTWA&s',
      verified: true,
      badges: [
        { id: 'giver', label: 'Community Giver', icon: 'heart' },
        { id: 'hero', label: 'Eco Hero', icon: 'star' },
      ],
    },
    likelyContents: [
      { id: 'c1', label: 'Mixed Veggies', percent: 75 },
      { id: 'c2', label: 'Mixed Fruits', percent: 60 },
      { id: 'c3', label: 'Herbs', percent: 50 },
    ],
  },
  {
    id: '5',
    title: 'Fresh Fruit Basket',
    price: 'RM18',
    isFree: false,
    isVerified: true,
    heroImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRQEytqdym2soe7nH5Tqqe4X1GvyNbDbUs0A&s',
    imperfectLevel: 40,
    seller: {
      id: 's1',
      name: 'Uncle Roger',
      rating: 4.9,
      boxesShared: 50,
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa3du6j726GP7-rDxHda8-FYopWptm3LsTWA&s',
      verified: true,
      badges: [
        { id: 'giver', label: 'Community Giver', icon: 'heart' },
        { id: 'hero', label: 'Eco Hero', icon: 'star' },
      ],
    },
    likelyContents: [
      { id: 'c1', label: 'Berries', percent: 85 },
      { id: 'c2', label: 'Grapes', percent: 80 },
      { id: 'c3', label: 'Melons', percent: 70 },
    ],
  },
  {
    id: '6',
    title: 'Mixed Veggie Box',
    price: 'RM10',
    isFree: false,
    isVerified: false,
    heroImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSimGyJxyM2BpGcrcv9_b_lskXGFHA_TPoOw&s',
    imperfectLevel: 65,
    seller: {
      id: 's1',
      name: 'Uncle Roger',
      rating: 4.9,
      boxesShared: 50,
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa3du6j726GP7-rDxHda8-FYopWptm3LsTWA&s',
      verified: true,
      badges: [
        { id: 'giver', label: 'Community Giver', icon: 'heart' },
        { id: 'hero', label: 'Eco Hero', icon: 'star' },
      ],
    },
    likelyContents: [
      { id: 'c1', label: 'Potatoes', percent: 90 },
      { id: 'c2', label: 'Onions', percent: 85 },
      { id: 'c3', label: 'Zucchini', percent: 60 },
    ],
  },
];

const ImperfectMeter = ({ value }: { value: number }) => (
  <View className="mt-4">
    <View className="flex-row justify-between mb-2">
      <Text className="text-sm" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
        Imperfect Meter
      </Text>
      <Text className="text-sm font-semibold" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
        {value}% imperfect
      </Text>
    </View>
    <View style={{ height: 12, backgroundColor: '#E8F3E0', borderRadius: 999 }}>
      <View
        style={{
          width: `${value}%`,
          height: '100%',
          borderRadius: 999,
          backgroundColor: '#C85E51',
        }}
      />
    </View>
  </View>
);

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  // TODO: Replace with API call to get user's favorited items
  const [favoritedIds, setFavoritedIds] = useState<string[]>(['1', '2', '3']); // Default favorites

  const product = useMemo(() => PRODUCT_DETAILS.find((item) => item.id === id) ?? PRODUCT_DETAILS[0], [id]);
  const isFavorited = favoritedIds.includes(product.id);

  const toggleFavorite = () => {
    setFavoritedIds((prev) => {
      if (prev.includes(product.id)) {
        return prev.filter((itemId) => itemId !== product.id);
      } else {
        return [...prev, product.id];
      }
    });
  };

  const handleCheckout = () => {
    router.push({
      pathname: '/checkout',
      params: {
        id: product.id,
        title: product.title,
        price: product.price,
        isFree: product.isFree ? 'true' : 'false',
        sellerId: product.seller.id,
      },
    });
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#365441' }}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        <ImageBackground
          source={{ uri: product.heroImage }}
          style={{ height: 320, justifyContent: 'space-between' }}
        >
          <View className="flex-row justify-between items-center px-4 pt-12">
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#ffffffee',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowLeft size={20} stroke="#2C4A34" />
            </TouchableOpacity>

            <View className="flex-row items-center" style={{ gap: 8 }}>
              {product.isVerified && (
                <View
                  className="flex-row items-center px-3 py-1 rounded-full"
                  style={{ backgroundColor: '#ffffffee' }}
                >
                  <ShieldCheck size={16} stroke="#2C4A34" />
                  <Text className="ml-2 text-sm font-semibold" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                    Verified Neighbor
                  </Text>
                </View>
              )}
              
              {/* Favorite Button */}
              <TouchableOpacity
                onPress={toggleFavorite}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#ffffffee',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Heart 
                  size={20} 
                  stroke="#C85E51" 
                  fill={isFavorited ? '#C85E51' : 'transparent'}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row justify-end px-4 pb-4">
            <View
              className="px-4 py-2 rounded-full"
              style={{ backgroundColor: product.isFree ? '#fda4af' : '#ffffffee' }}
            >
              <Text
                className="text-base font-semibold"
                style={{ color: product.isFree ? '#ffffff' : '#2C4A34', fontFamily: 'System' }}
              >
                {product.isFree ? 'Community Gift' : product.price}
              </Text>
            </View>
          </View>
        </ImageBackground>

        <View className="px-4 mt-6">
          <Text className="text-3xl font-bold mb-2" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            {product.title}
          </Text>
          <Text className="text-base mb-4" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            Surprise box curated by your neighbors. Perfect for soups, stir-fry, and juicing.
          </Text>

          {/* Likely to Contain */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
              Likely to Contain
            </Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={product.likelyContents}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  className="items-center px-4 py-3 rounded-3xl mr-3"
                  style={{ backgroundColor: '#2C4A34', minWidth: 120 }}
                >
                  <Leaf size={20} stroke="#E8F3E0" />
                  <Text className="text-sm mt-2" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                    {item.label}
                  </Text>
                  <Text className="text-lg font-bold" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                    {item.percent}%
                  </Text>
                </View>
              )}
            />
          </View>

          <ImperfectMeter value={product.imperfectLevel} />

          {/* Seller Preview */}
          <View className="mt-8 p-5 rounded-3xl" style={{ backgroundColor: '#2C4A34' }}>
            <TouchableOpacity 
              onPress={() => router.push(`/seller-profile/${product.seller.id}`)}
              className="flex-row items-center mb-4"
            >
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  overflow: 'hidden',
                  marginRight: 12,
                  backgroundColor: '#E8F3E0',
                }}
              >
                <Image
                  source={{ uri: product.seller.avatar }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="text-lg font-semibold" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                    {product.seller.name}
                  </Text>
                  {product.seller.verified && (
                    <ShieldCheck size={16} stroke="#4ade80" fill="#4ade80" style={{ marginLeft: 6 }} />
                  )}
                </View>
                <View className="flex-row items-center mt-1">
                  <Star size={16} stroke="#facc15" fill="#facc15" />
                  <Text className="ml-1 text-sm" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                    {product.seller.rating} rating • {product.seller.boxesShared}+ boxes shared
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            
            {/* Badges */}
            {product.seller.badges && product.seller.badges.length > 0 && (
              <View>
                <Text className="text-sm font-semibold mb-2" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                  Seller Badges
                </Text>
                <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                  {product.seller.badges.map((badge: any) => (
                    <View
                      key={badge.id}
                      className="flex-row items-center px-3 py-2 rounded-full"
                      style={{ backgroundColor: '#365441' }}
                    >
                      {badge.icon === 'heart' && <Heart size={14} stroke="#fda4af" fill="#fda4af" />}
                      {badge.icon === 'star' && <Star size={14} stroke="#facc15" fill="#facc15" />}
                      <Text className="text-xs font-semibold ml-1" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                        {badge.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View className="px-4 pb-6">
        <TouchableOpacity
          className="py-4 rounded-3xl items-center"
          style={{ backgroundColor: '#C85E51' }}
          onPress={handleCheckout}
        >
          <Text className="text-white text-lg font-bold uppercase" style={{ fontFamily: 'System' }}>
            Rescue This Box
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

