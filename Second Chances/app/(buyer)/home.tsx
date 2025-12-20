import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StatusBar, ImageBackground, PanResponder, Dimensions, BackHandler, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Menu, Search, ShieldCheck, MapPin, Heart } from 'lucide-react-native';
import '../../global.css';
import { API_URL } from '../../config/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FILTERS = ['All', 'Free Gifts', 'Veg', 'Fruit'];

// Demo products shown on the home screen when there are no real products from the API.
// IDs and names match the demo favorites and product detail screen.
const DEMO_HOME_PRODUCTS = [
  {
    id: 'demo-1',
    name: 'Rescued Veggie Box',
    price: 10,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRQEytqdym2soe7nH5Tqqe4X1GvyNbDbUs0A&s',
    category: 'Veg',
    isFree: false,
    isVerified: true,
  },
  {
    id: 'demo-2',
    name: 'Sunrise Fruit Crate',
    price: 15,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSimGyJxyM2BpGcrcv9_b_lskXGFHA_TPoOw&s',
    category: 'Fruit',
    isFree: false,
    isVerified: true,
  },
  {
    id: 'demo-3',
    name: 'Organic Veg Rescue',
    price: 12,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0NTZmv6zIanNf621NF_dJQNoCb4eYQNAAzQ&s',
    category: 'Veg',
    isFree: false,
    isVerified: true,
  },
  {
    id: 'demo-4',
    name: "Neighbor's Free Gift",
    price: 0,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmAps3JJfGUb6r7bvZZL6zHjAzgxvMvD2Ijg&s',
    category: 'Mixed',
    isFree: true,
    isVerified: true,
  },
  {
    id: 'demo-5',
    name: 'Fresh Fruit Basket',
    price: 18,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRQEytqdym2soe7nH5Tqqe4X1GvyNbDbUs0A&s',
    category: 'Fruit',
    isFree: false,
    isVerified: true,
  },
  {
    id: 'demo-6',
    name: 'Mixed Veggie Box',
    price: 10,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSimGyJxyM2BpGcrcv9_b_lskXGFHA_TPoOw&s',
    category: 'Veg',
    isFree: false,
    isVerified: false,
  },
];

export default function BuyerHomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // TODO: Replace with API call to get user's favorited items
  const [favoritedIds, setFavoritedIds] = useState<string[]>([]); // Default favorites

  const toggleFavorite = (productId: string) => {
    setFavoritedIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Prevent back navigation to login screen
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Prevent going back to login/role-selection
        return true; // Return true to prevent default back behavior
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => backHandler.remove();
    }, [])
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Match seller pattern: rightward swipe from left edge opens menu
        return gestureState.dx > 0 && evt.nativeEvent.pageX < 50;
      },
      onPanResponderRelease: (evt, gestureState) => {
        // If swiped more than 30% of screen width, navigate to menu
        if (gestureState.dx > SCREEN_WIDTH * 0.3) {
          router.push('/(buyer)/menu');
        }
      },
    })
  ).current;

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();

        if (activeFilter === 'Free Gifts') {
          params.append('filter', 'free');
        } else if (activeFilter === 'Veg') {
          params.append('filter', 'veg');
        } else if (activeFilter === 'Fruit') {
          params.append('filter', 'fruit');
        }

        if (searchQuery) {
          params.append('search', searchQuery);
        }

        const url =
          params.toString().length > 0
            ? `${API_URL}/api/products?${params.toString()}`
            : `${API_URL}/api/products`;

        const response = await fetch(url, { signal: controller.signal });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || 'Failed to load products');
        }

        if (Array.isArray(data) && data.length > 0) {
          if (activeFilter === 'All') {
            // For the main "All" view, show demo blindboxes together with real products
            setProducts([...DEMO_HOME_PRODUCTS, ...data]);
          } else {
            setProducts(data);
          }
        } else {
          // No real products from API - show demo products
          setProducts(DEMO_HOME_PRODUCTS);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError('Unable to load products. Please try again.');
          // On errors (e.g., server unavailable), also fall back to demo products
          setProducts(DEMO_HOME_PRODUCTS);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [activeFilter, searchQuery]);

  const filteredData = useMemo(() => products, [products]);

  const renderProductCard = ({ item }: { item: any }) => {
    const productId = item._id || item.id;
    const isFree = item.price === 0;
    const isFavorited = favoritedIds.includes(productId);
    const imageUri = item.imageUrl
      ? item.imageUrl.startsWith('http')
        ? item.imageUrl
        : `${API_URL}${item.imageUrl}`
      : undefined;
    
    return (
    <View className="flex-1 mb-4" style={{ marginHorizontal: 4, position: 'relative' }}>
      <TouchableOpacity
        className="rounded-3xl"
        style={{ backgroundColor: '#E8F3E0' }}
        onPress={() => {
          if (!productId) {
            Alert.alert('Cannot open product', 'This product is not available to view.');
            return;
          }

          const idStr = String(productId);
          const isDemo = idStr.startsWith('demo-');

          // Only block clearly invalid, non-demo IDs
          if (!isDemo && !/^[0-9a-fA-F]{24}$/.test(idStr)) {
            Alert.alert('Cannot open product', 'This product is not available to view.');
            return;
          }

          router.push({
            pathname: '/product/[id]',
            params: { id: idStr },
          });
        }}
      >
        <ImageBackground
          source={{ uri: imageUri }}
          style={{ height: 140, borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' }}
          imageStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
          defaultSource={require('../../assets/logo.png')}
        >
          <View className="p-3 flex-row justify-between items-start">
            <View className="flex-1 flex-row items-start" style={{ gap: 6 }}>
              {item.isFree && (
                <View
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: '#fda4af' }}
                >
                  <Text className="text-xs font-semibold" style={{ color: '#fff', fontFamily: 'System' }}>
                    FREE
                  </Text>
                </View>
              )}
              {item.isVerified && (
                <View
                  className="px-2 py-1 rounded-full flex-row items-center"
                  style={{ backgroundColor: '#ffffffdd' }}
                >
                  <ShieldCheck size={14} stroke="#2C4A34" />
                  <Text className="text-xs font-semibold ml-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                    Verified
                  </Text>
                </View>
              )}
            </View>
            
            {/* Favorite Button */}
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                toggleFavorite(productId);
              }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
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
        </ImageBackground>

        <View className="p-4">
          <Text className="text-base font-semibold mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
            {item.name}
          </Text>
          <View className="flex-row items-center mb-2">
            <MapPin size={14} stroke="#6b7280" />
            <Text className="text-xs ml-1" style={{ color: '#6b7280', fontFamily: 'System' }}>
              Nearby
            </Text>
          </View>
          <Text className="text-lg font-bold" style={{ color: isFree ? '#C85E51' : '#2C4A34', fontFamily: 'System' }}>
            {isFree ? 'Community Gift' : `RM${item.price}`}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#365441' }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4" style={{ paddingTop: 60, paddingBottom: 12, backgroundColor: '#2C4A34' }}>
        <TouchableOpacity onPress={() => router.push('/(buyer)/menu')}>
          <Menu size={24} stroke="#ffffff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold" style={{ fontFamily: 'System' }}>
          Second Chances
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View 
        className="flex-1 px-4 pt-4"
        {...panResponder.panHandlers}
      >
        {/* Search */}
        <View
          className="flex-row items-center px-4 rounded-3xl mb-4"
          style={{ backgroundColor: '#E8F3E0' }}
        >
          <Search size={20} stroke="#6b7280" />
          <TextInput
            placeholder="Search blind boxes nearby"
            placeholderTextColor="#6b7280"
            className="flex-1 ml-2 py-3"
            style={{ color: '#2C4A34', fontFamily: 'System' }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Chips */}
        <View className="flex-row justify-between mb-4">
          {FILTERS.map((item, index) => (
            <TouchableOpacity
              key={item}
              onPress={() => setActiveFilter(item)}
              style={{
                flex: 1,
                marginRight: index !== FILTERS.length - 1 ? 8 : 0,
                backgroundColor: activeFilter === item ? '#2C4A34' : '#E8F3E0',
                borderWidth: activeFilter === item ? 0 : 1,
                borderColor: '#2C4A34',
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 999,
                paddingHorizontal: 8,
              }}
            >
              <Text
                className="text-sm font-semibold text-center"
                style={{
                  color: activeFilter === item ? '#ffffff' : '#2C4A34',
                  fontFamily: 'System',
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Product Grid */}
        <FlatList
          data={filteredData}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={renderProductCard}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center mt-12">
              <Text className="text-base" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                No boxes found. Try another filter.
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

