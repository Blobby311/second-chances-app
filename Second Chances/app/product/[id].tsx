import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground, FlatList, Image, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ShieldCheck, Leaf, Star, Heart } from 'lucide-react-native';
import '../../global.css';
import { API_URL } from '../../config/api';
import { getAuthToken } from '../../config/auth';

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

interface Product {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  deliveryMethod: string;
  imperfectLevel?: number;
  likelyContents?: Array<{ label: string; percent: number }>;
  seller?: {
    _id?: string;
    id?: string;
    name: string;
    avatar?: string;
    isVerified?: boolean;
  };
}

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoritedIds, setFavoritedIds] = useState<string[]>([]);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/products/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to load product');
        }

        const data = await response.json();
        setProduct(data);
      } catch (error: any) {
        console.error('Error fetching product:', error);
        Alert.alert('Error', 'Failed to load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Fetch favorites
    const fetchFavorites = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        const response = await fetch(`${API_URL}/api/user/favorites`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const favorites = await response.json();
          const favoriteIds = favorites.map((fav: any) => fav._id || fav.id || fav.product?._id || fav.product?.id);
          setFavoritedIds(favoriteIds);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    if (id) {
      fetchProduct();
      fetchFavorites();
    }
  }, [id]);

  if (loading || !product) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: '#365441' }}>
        <ActivityIndicator size="large" color="#E8F3E0" />
      </View>
    );
  }

  const productId = product._id || product.id || id;
  const isFavorited = favoritedIds.includes(productId);
  const isFree = product.price === 0;
  const priceDisplay = isFree ? 'Free' : `RM${product.price.toFixed(2)}`;
  
  // Format image URL
  const imageUrl = product.imageUrl
    ? product.imageUrl.startsWith('http')
      ? product.imageUrl
      : `${API_URL}${product.imageUrl}`
    : undefined;

  const toggleFavorite = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        Alert.alert('Authentication Required', 'Please log in to favorite products.');
        return;
      }

      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(`${API_URL}/api/user/favorites/${productId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setFavoritedIds((prev) => prev.filter((favId) => favId !== productId));
        }
      } else {
        // Add to favorites
        const response = await fetch(`${API_URL}/api/user/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: productId }),
        });

        if (response.ok) {
          setFavoritedIds((prev) => [...prev, productId]);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleCheckout = () => {
    router.push({
      pathname: '/checkout',
      params: {
        id: productId,
        title: product.name,
        price: product.price.toString(),
        isFree: isFree ? 'true' : 'false',
        sellerId: product.seller?._id || product.seller?.id || '',
      },
    });
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#365441' }}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        <ImageBackground
          source={{ uri: imageUrl || 'https://via.placeholder.com/400' }}
          style={{ height: 320, justifyContent: 'space-between' }}
          defaultSource={require('../../assets/logo.png')}
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
              {product.seller?.isVerified && (
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
              style={{ backgroundColor: isFree ? '#fda4af' : '#ffffffee' }}
            >
              <Text
                className="text-base font-semibold"
                style={{ color: isFree ? '#ffffff' : '#2C4A34', fontFamily: 'System' }}
              >
                {isFree ? 'Community Gift' : priceDisplay}
              </Text>
            </View>
          </View>
        </ImageBackground>

        <View className="px-4 mt-6">
          <Text className="text-3xl font-bold mb-2" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            {product.name}
          </Text>
          <Text className="text-base mb-4" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
            {product.description || 'Surprise box curated by your neighbors. Perfect for soups, stir-fry, and juicing.'}
          </Text>

          {/* Product Info */}
          <View className="mb-4 p-4 rounded-3xl" style={{ backgroundColor: '#2C4A34' }}>
            <View className="flex-row items-center mb-2">
              <Text className="text-sm font-semibold mr-2" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                Category:
              </Text>
              <Text className="text-sm" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                {product.category}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-sm font-semibold mr-2" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                Delivery:
              </Text>
              <Text className="text-sm" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                {product.deliveryMethod}
              </Text>
            </View>
          </View>

          {/* Likely to Contain */}
          {product.likelyContents && product.likelyContents.length > 0 && (
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-3" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                Likely to Contain
              </Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={product.likelyContents}
                keyExtractor={(item, index) => item.label || index.toString()}
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
          )}

          <ImperfectMeter value={product.imperfectLevel || 50} />

          {/* Seller Preview */}
          {product.seller && (
            <View className="mt-8 p-5 rounded-3xl" style={{ backgroundColor: '#2C4A34' }}>
              <TouchableOpacity 
                onPress={() => router.push(`/seller-profile/${product.seller?._id || product.seller?.id}`)}
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
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {product.seller.avatar ? (
                    <Image
                      source={{ uri: product.seller.avatar }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text className="text-2xl font-semibold" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                      {product.seller.name[0]}
                    </Text>
                  )}
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-lg font-semibold" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                      {product.seller.name}
                    </Text>
                    {product.seller.isVerified && (
                      <ShieldCheck size={16} stroke="#4ade80" fill="#4ade80" style={{ marginLeft: 6 }} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
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
