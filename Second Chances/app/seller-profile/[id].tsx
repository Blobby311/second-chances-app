import React, { useMemo, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Image, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ShieldCheck, MessageCircle, Package, Star, Heart } from 'lucide-react-native';
import '../../global.css';
import { API_URL } from '../../config/api';

// Badge image mapping
const BADGE_IMAGES: { [key: string]: any } = {
  'giver.png': require('../../assets/badges/giver.png'),
  'hero.png': require('../../assets/badges/hero.png'),
  'eco-hero.png': require('../../assets/badges/eco-hero.png'),
  'trusted.png': require('../../assets/badges/trusted.png'),
  'weekly.png': require('../../assets/badges/weekly.png'),
};

type ApiBadge = {
  _id: string;
  name: string;
  icon: string;
};

type ApiReview = {
  _id: string;
  stars: number;
  feedback?: string;
  createdAt: string;
  rater?: {
    name: string;
    avatar?: string;
  };
};

type ApiSellerProfile = {
  _id: string;
  name: string;
  avatar?: string;
  rating?: number;
  boxesShared?: number;
  badges?: ApiBadge[];
  reviews?: ApiReview[];
};

const DEMO_SELLERS: Record<string, ApiSellerProfile> = {
  'demo-seller-1': {
    _id: 'demo-seller-1',
    name: 'Uncle Roger',
    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa3du6j726GP7-rDxHda8-FYopWptm3LsTWA&s',
    rating: 4.8,
    boxesShared: 120,
    badges: [],
    reviews: [],
  },
  'demo-seller-2': {
    _id: 'demo-seller-2',
    name: 'Kak Siti',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=60',
    rating: 4.9,
    boxesShared: 80,
    badges: [],
    reviews: [],
  },
  'demo-seller-3': {
    _id: 'demo-seller-3',
    name: 'Organic Neighbor',
    rating: 4.7,
    boxesShared: 60,
    badges: [],
    reviews: [],
  },
  'demo-seller-4': {
    _id: 'demo-seller-4',
    name: 'Friendly Neighbor',
    rating: 4.6,
    boxesShared: 40,
    badges: [],
    reviews: [],
  },
};

// Map route IDs (demo-seller-* or sample-* chat IDs) to canonical demo seller IDs
const DEMO_SELLER_ID_ALIASES: Record<string, string> = {
  'demo-seller-1': 'demo-seller-1',
  'demo-seller-2': 'demo-seller-2',
  'demo-seller-3': 'demo-seller-3',
  'demo-seller-4': 'demo-seller-4',
  // Chat sample IDs
  'sample-1': 'demo-seller-1',
  'sample-2': 'demo-seller-2',
  'sample-b1': 'demo-seller-3',
  'sample-b2': 'demo-seller-4',
};

// Map canonical demo seller IDs to their corresponding sample chat IDs
const DEMO_SELLER_CHAT_IDS: Record<string, string> = {
  'demo-seller-1': 'sample-1',
  'demo-seller-2': 'sample-2',
  'demo-seller-3': 'sample-b1',
  'demo-seller-4': 'sample-b2',
};

export default function SellerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [seller, setSeller] = useState<ApiSellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const demoSellerKey = id ? DEMO_SELLER_ID_ALIASES[id] : undefined;
  const isDemoSeller = !!demoSellerKey;

  useEffect(() => {
    const fetchSeller = async () => {
      if (!id) return;

      // Handle demo sellers entirely on the client
      if (isDemoSeller && demoSellerKey) {
        const demoSeller = DEMO_SELLERS[demoSellerKey];
        if (demoSeller) {
          setSeller(demoSeller);
          setError(null);
        } else {
          setSeller(null);
          setError('Demo seller not found.');
        }
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Validate Mongo ObjectId format before hitting the backend
        if (!/^[0-9a-fA-F]{24}$/.test(id)) {
          setError('Invalid seller ID.');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/api/sellers/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || 'Failed to load seller profile');
        }

        setSeller(data);
      } catch (err: any) {
        console.error('Error fetching seller profile:', err);
        setError(err?.message || 'Failed to load seller profile');
      } finally {
        setLoading(false);
      }
    };

    fetchSeller();
  }, [id, isDemoSeller, demoSellerKey]);

  const displayName = seller?.name || 'Seller';
  const sellerType = 'Community Seller';
  const verified = true;

  const stats = useMemo(() => {
    const boxes = seller?.boxesShared ?? 0;
    const rating = seller?.rating ?? 0;
    return {
      boxesShared: `${boxes}+ Boxes`,
      rating: `${rating.toFixed(1)} Rating`,
      replyRate: '100% Reply',
    };
  }, [seller]);

  const STAT_ICONS = [
    { id: 'boxes', label: stats.boxesShared, icon: Package },
    { id: 'rating', label: stats.rating, icon: Star },
    { id: 'reply', label: stats.replyRate, icon: Heart },
  ];

  const getBadgeImage = (badgeIcon: string | null) => {
    if (!badgeIcon) return null;
    return BADGE_IMAGES[badgeIcon] || null;
  };

  const sellerBadges = seller?.badges ?? [];
  const sellerReviews = seller?.reviews ?? [];

  const renderReview = ({ item }: { item: ApiReview }) => (
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
            {item.rater?.name || 'Buyer'}
          </Text>
          <Text className="text-sm mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
            {item.rater?.name ? `@${item.rater.name.split(' ')[0].toLowerCase()}` : ''}
          </Text>
          <Text className="text-xs mb-2" style={{ color: '#6b7280', fontFamily: 'System' }}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View className="flex-row">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              size={16}
              stroke="#fbbf24"
              fill={idx < item.stars ? '#fbbf24' : 'none'}
            />
          ))}
        </View>
      </View>
      {item.feedback ? (
        <Text className="text-sm" style={{ color: '#2C4A34', fontFamily: 'System' }}>
          {item.feedback}
        </Text>
      ) : null}
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: '#365441' }}>
        <ActivityIndicator size="large" color="#E8F3E0" />
      </View>
    );
  }

  if (error || !seller) {
    return (
      <View className="flex-1 items-center justify-center px-4" style={{ backgroundColor: '#365441' }}>
        <Text className="text-lg mb-4 text-center" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
          {error || 'Seller not found.'}
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (!id) {
              return;
            }
            router.back();
          }}
          className="py-3 px-6 rounded-3xl"
          style={{ backgroundColor: '#C85E51' }}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#E8F3E0',
            }}
          >
            {seller.avatar ? (
              <Image
                source={{ uri: seller.avatar }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <Text className="text-3xl font-bold" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                {displayName[0]}
              </Text>
            )}
          </View>
          
          <Text className="text-2xl font-bold mb-2" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            {displayName}
          </Text>
          
          <Text className="text-base mb-4" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            {sellerType}
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
            {verified && (
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
            {sellerBadges.map((badge) => {
              const badgeImage = getBadgeImage(badge.icon);
              return (
                <View
                  key={badge._id}
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
            data={sellerReviews}
            renderItem={renderReview}
            keyExtractor={(item) => item._id}
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
          onPress={() => {
            if (!id) return;

            // For demo sellers, route to the matching sample chat ID
            const demoKey = DEMO_SELLER_ID_ALIASES[id];
            if (demoKey) {
              const chatId = DEMO_SELLER_CHAT_IDS[demoKey];
              if (chatId) {
                router.push(`/chat/${encodeURIComponent(chatId)}?name=${encodeURIComponent(displayName)}`);
                return;
              }
            }

            // Real sellers: use backend user ID as chat target
            if (!seller?._id) return;
            router.push(`/chat/${seller._id}?name=${encodeURIComponent(displayName)}`);
          }}
        >
          <MessageCircle size={20} stroke="#ffffff" />
          <Text className="text-white text-lg font-bold ml-2" style={{ fontFamily: 'System' }}>
            Chat with {displayName.split(' ')[0]}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
