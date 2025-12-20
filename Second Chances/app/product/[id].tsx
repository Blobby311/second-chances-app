import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ImageBackground, FlatList, Image, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
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

const DEMO_PRODUCTS: Record<string, Product> = {
  'demo-1': {
    id: 'demo-1',
    name: 'Rescued Veggie Box',
    description: 'A box of rescued vegetables perfect for soups, stir-fry, and juicing.',
    price: 10,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRQEytqdym2soe7nH5Tqqe4X1GvyNbDbUs0A&s',
    category: 'Veg',
    deliveryMethod: 'Pickup only',
    imperfectLevel: 40,
    likelyContents: [
      { label: 'Leafy greens', percent: 40 },
      { label: 'Root vegetables', percent: 60 },
    ],
    seller: {
      id: 'demo-seller-1',
      name: 'Uncle Roger',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa3du6j726GP7-rDxHda8-FYopWptm3LsTWA&s',
      isVerified: true,
    },
  },
  'demo-2': {
    id: 'demo-2',
    name: 'Sunrise Fruit Crate',
    description: 'Assorted rescued fruits for breakfast bowls, juices, and snacks.',
    price: 15,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSimGyJxyM2BpGcrcv9_b_lskXGFHA_TPoOw&s',
    category: 'Fruit',
    deliveryMethod: 'Pickup only',
    imperfectLevel: 30,
    likelyContents: [
      { label: 'Citrus mix', percent: 50 },
      { label: 'Assorted fruits', percent: 50 },
    ],
    seller: {
      id: 'demo-seller-2',
      name: 'Kak Siti',
      isVerified: true,
    },
  },
  'demo-3': {
    id: 'demo-3',
    name: 'Organic Veg Rescue',
    description: 'Organic but slightly imperfect vegetables rescued from going to waste.',
    price: 12,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0NTZmv6zIanNf621NF_dJQNoCb4eYQNAAzQ&s',
    category: 'Veg',
    deliveryMethod: 'Pickup only',
    imperfectLevel: 35,
    likelyContents: [
      { label: 'Organic greens', percent: 60 },
      { label: 'Root veg mix', percent: 40 },
    ],
    seller: {
      id: 'demo-seller-3',
      name: 'Organic Neighbor',
      isVerified: true,
    },
  },
  'demo-4': {
    id: 'demo-4',
    name: "Neighbor's Free Gift",
    description: 'A surprise box gifted by your neighbor. Completely free, just pick up!',
    price: 0,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmAps3JJfGUb6r7bvZZL6zHjAzgxvMvD2Ijg&s',
    category: 'Mixed',
    deliveryMethod: 'Pickup only',
    imperfectLevel: 50,
    likelyContents: [
      { label: 'Mixed fruits & veg', percent: 100 },
    ],
    seller: {
      id: 'demo-seller-4',
      name: 'Friendly Neighbor',
      isVerified: true,
    },
  },
  'demo-5': {
    id: 'demo-5',
    name: 'Fresh Fruit Basket',
    description: 'Mixed fruit basket rescued from oversupply. Sweet and juicy.',
    price: 18,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRQEytqdym2soe7nH5Tqqe4X1GvyNbDbUs0A&s',
    category: 'Fruit',
    deliveryMethod: 'Pickup only',
    imperfectLevel: 25,
    likelyContents: [
      { label: 'Assorted fruits', percent: 100 },
    ],
    seller: {
      id: 'demo-seller-5',
      name: 'Local Grocer',
      isVerified: true,
    },
  },
  'demo-6': {
    id: 'demo-6',
    name: 'Mixed Veggie Box',
    description: 'A mix of rescued vegetables, perfect for weekly meal prep.',
    price: 10,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSimGyJxyM2BpGcrcv9_b_lskXGFHA_TPoOw&s',
    category: 'Veg',
    deliveryMethod: 'Pickup only',
    imperfectLevel: 45,
    likelyContents: [
      { label: 'Mixed vegetables', percent: 100 },
    ],
    seller: {
      id: 'demo-seller-6',
      name: 'Market Stall',
      isVerified: false,
    },
  },
};

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [favoritedIds, setFavoritedIds] = useState<string[]>([]);
  const isDemoProductId = typeof id === 'string' && id.startsWith('demo-');

  // Fetch product details
  const fetchProduct = useCallback(async () => {
    try {
      if (!id) {
        return;
      }

      if (isDemoProductId) {
        // Demo products are handled locally without API calls
        return;
      }

      // Validate id before attempting fetch
      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        console.warn('fetchProduct called with invalid id:', id);
        setErrorMsg('Invalid product ID.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMsg(null);
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(`Error fetching product (status ${response.status}):`, text);
        setErrorMsg(`Failed to load product (${response.status})`);
        return;
      }

      const data = await response.json();
      setProduct(data);
    } catch (error: any) {
      console.error('Error fetching product:', error);
      setErrorMsg(error?.message || 'Failed to load product');
      Alert.alert('Error', 'Failed to load product details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id, isDemoProductId]);

  // Fetch favorites
  const fetchFavorites = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    if (!id) {
      return;
    }

    if (isDemoProductId) {
      const demo = DEMO_PRODUCTS[id] || {
        id,
        name: 'Demo Product',
        description: 'This is a demo product used for testing.',
        price: 0,
        imageUrl: 'https://via.placeholder.com/400',
        category: 'Demo',
        deliveryMethod: 'Pickup only',
      };
      setProduct(demo);
      setErrorMsg(null);
      setLoading(false);
      return;
    }

    // Validate Mongo ObjectId format before attempting a fetch to avoid backend cast errors
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      setLoading(false);
      setErrorMsg('Invalid product ID.');
      return;
    }

    fetchProduct();
    fetchFavorites();
  }, [id, isDemoProductId, fetchProduct, fetchFavorites]);

  // Refresh when screen is focused (e.g., when navigating back from edit)
  useFocusEffect(
    useCallback(() => {
      if (!id) {
        return;
      }

      if (isDemoProductId) {
        const demo = DEMO_PRODUCTS[id];
        if (demo) {
          setProduct(demo);
          setErrorMsg(null);
          setLoading(false);
        }
        return;
      }

      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        setErrorMsg('Invalid product ID.');
        return;
      }
      fetchProduct();
    }, [id, isDemoProductId, fetchProduct])
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: '#365441' }}>
        <ActivityIndicator size="large" color="#E8F3E0" />
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center px-4" style={{ backgroundColor: '#365441' }}>
        <Text className="text-lg mb-4 text-center" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
          {errorMsg || 'Product not found.'}
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
              Alert.alert('Cannot reload', 'Invalid product ID.');
              return;
            }
            fetchProduct();
          }}
          className="py-3 px-6 rounded-3xl"
          style={{ backgroundColor: '#C85E51' }}
        >
          <Text className="text-white font-semibold">Retry</Text>
        </TouchableOpacity>
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
    if (!productId) {
      return;
    }

    const isDemo = typeof productId === 'string' && productId.startsWith('demo-');
    if (isDemo) {
      setFavoritedIds((prev) =>
        prev.includes(productId)
          ? prev.filter((favId) => favId !== productId)
          : [...prev, productId]
      );
      return;
    }

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
        sellerName: product.seller?.name || '',
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
