import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StatusBar, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, Search, Heart, ShieldCheck, MapPin } from 'lucide-react-native';
import '../../global.css';

// TODO: Replace with API call - This should show all available products from seller's stock
const ALL_PRODUCTS = [
  {
    id: '1',
    title: 'Rescued Veggie Box',
    price: 'RM10',
    distance: '2.4 km',
    isFree: false,
    isVerified: true,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRQEytqdym2soe7nH5Tqqe4X1GvyNbDbUs0A&s',
  },
  {
    id: '2',
    title: 'Sunrise Fruit Crate',
    price: 'RM15',
    distance: '1.2 km',
    isFree: false,
    isVerified: true,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSimGyJxyM2BpGcrcv9_b_lskXGFHA_TPoOw&s',
  },
  {
    id: '3',
    title: 'Organic Veg Rescue',
    price: 'RM12',
    distance: '3.1 km',
    isFree: false,
    isVerified: true,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0NTZmv6zIanNf621NF_dJQNoCb4eYQNAAzQ&s',
  },
  {
    id: '4',
    title: "Neighbor's Free Gift",
    price: 'RM0',
    distance: '4.5 km',
    isFree: true,
    isVerified: true,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmAps3JJfGUb6r7bvZZL6zHjAzgxvMvD2Ijg&s',
  },
  {
    id: '5',
    title: 'Fresh Fruit Basket',
    price: 'RM18',
    distance: '2.8 km',
    isFree: false,
    isVerified: true,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRQEytqdym2soe7nH5Tqqe4X1GvyNbDbUs0A&s',
  },
  {
    id: '6',
    title: 'Mixed Veggie Box',
    price: 'RM10',
    distance: '1.9 km',
    isFree: false,
    isVerified: false,
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSimGyJxyM2BpGcrcv9_b_lskXGFHA_TPoOw&s',
  },
];

export default function FavoritesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  // TODO: Replace with API call to get user's favorited items
  const [favoritedIds, setFavoritedIds] = useState<string[]>(['1', '2', '3']); // Default favorites

  const toggleFavorite = (productId: string) => {
    setFavoritedIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const filteredData = useMemo(() => {
    // Only show products that are favorited
    return ALL_PRODUCTS.filter((item) => 
      favoritedIds.includes(item.id) &&
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, favoritedIds]);

  const renderProductCard = ({ item }: { item: typeof ALL_PRODUCTS[0] }) => {
    const isFavorited = favoritedIds.includes(item.id);
    
    return (
    <View className="flex-1 mb-4" style={{ marginHorizontal: 4, position: 'relative' }}>
      <TouchableOpacity
        className="rounded-3xl"
        style={{ backgroundColor: '#E8F3E0' }}
        onPress={() =>
          router.push({
            pathname: '/product/[id]',
            params: { id: item.id },
          })
        }
      >
        <ImageBackground
          source={{ uri: item.imageUrl }}
          style={{ height: 140, borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' }}
          imageStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
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
                toggleFavorite(item.id);
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
            {item.title}
          </Text>
          <View className="flex-row items-center mb-2">
            <MapPin size={14} stroke="#6b7280" />
            <Text className="text-xs ml-1" style={{ color: '#6b7280', fontFamily: 'System' }}>
              {item.distance} away
            </Text>
          </View>
          <Text className="text-lg font-bold" style={{ color: item.isFree ? '#C85E51' : '#2C4A34', fontFamily: 'System' }}>
            {item.isFree ? 'Community Gift' : item.price}
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
      <View
        className="flex-row items-center justify-between px-4"
        style={{ backgroundColor: '#2C4A34', paddingTop: 60, paddingBottom: 12 }}
      >
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Menu size={24} stroke="#ffffff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold" style={{ fontFamily: 'System' }}>
          Favorites
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View className="flex-1 px-4 pt-4">
        {/* Search */}
        <View
          className="flex-row items-center px-4 rounded-3xl mb-4"
          style={{ backgroundColor: '#E8F3E0' }}
        >
          <Search size={20} stroke="#6b7280" />
          <TextInput
            placeholder="Search favorites"
            placeholderTextColor="#6b7280"
            className="flex-1 ml-2 py-3"
            style={{ color: '#2C4A34', fontFamily: 'System' }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Favorites List */}
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
              <Heart size={48} stroke="#E8F3E0" fill="none" />
              <Text className="text-base mt-4" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
                No favorites yet. Start adding some!
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

