import React, { useState, useMemo, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StatusBar, ScrollView, PanResponder, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, Search, Bot } from 'lucide-react-native';
import '../../global.css';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// TODO: Replace with API call
// Plants commonly found in Sarawak - 2 per category
const PLANTS_DATA = [
  { id: '1', name: 'Kangkung', category: 'Vegetables', imageUrl: 'https://live.staticflickr.com/2826/12166793135_a1a896d781_b.jpg' },
  { id: '2', name: 'Paku', category: 'Vegetables', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7IcJNso-RE0NHqs8bveERq5euwKvtJSmrlw&s' },
  { id: '3', name: 'Durian', category: 'Fruits', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7R6riQWgGlRXbCwYfNv0jkAO2T_pu299ugA&s' },
  { id: '4', name: 'Rambutan', category: 'Fruits', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKhvSaTPtcqJWiPBgjyxLqQjLLpDW-5uz1jw&s' },
  { id: '5', name: 'Pandan', category: 'Herbs', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPWyp-ZSz15l4185S-MRo6OyWS8dHiIbk3aA&s' },
  { id: '6', name: 'Serai', category: 'Herbs', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/YosriNov04Pokok_Serai.JPG' },
];

const CATEGORIES = ['Vegetables', 'Fruits', 'Herbs'];

export default function EduHubScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Vegetables');
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

  const filteredPlants = useMemo(() => {
    return PLANTS_DATA.filter((plant) => {
      const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = plant.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const renderPlantCard = ({ item }: { item: typeof PLANTS_DATA[0] }) => {
    return (
    <TouchableOpacity
        onPress={() => router.push(`/(seller)/guide/${item.id}`)}
        className="flex-1 rounded-3xl mb-4 overflow-hidden"
      style={{ 
        backgroundColor: '#E8F3E0',
          marginHorizontal: 4, 
          minHeight: 180,
        borderWidth: 1,
        borderColor: '#2C4A34',
      }}
    >
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: '100%', height: 140, resizeMode: 'cover' }}
          />
        ) : (
          <View className="items-center justify-center" style={{ height: 140, backgroundColor: '#FDFBF5' }}>
            <Text className="text-sm" style={{ color: '#6b7280', fontFamily: 'System' }}>
              Image coming soon
            </Text>
        </View>
        )}
        <View style={{ padding: 12 }}>
          <Text className="text-base font-semibold text-center" style={{ color: '#2C4A34', fontFamily: 'System' }}>
        {item.name}
      </Text>
        </View>
    </TouchableOpacity>
  );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#365441' }}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View 
        className="flex-row items-center px-4"
        style={{ backgroundColor: '#2C4A34', paddingTop: 60, paddingBottom: 12 }}
      >
        <TouchableOpacity onPress={() => router.push('/(seller)/menu')} className="mr-3">
            <Menu size={24} stroke="#ffffff" />
          </TouchableOpacity>
        <Text className="text-xl font-bold flex-1 text-center" style={{ color: '#ffffff', fontFamily: 'System' }}>
          Vegetable & Fruit Guides
            </Text>
        <View style={{ width: 24 }} />
      </View>

      <View
        style={{ flex: 1 }}
        {...panResponder.panHandlers}
      >
      <ScrollView 
        className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
      >
        {/* AI Chatbot Section */}
        <TouchableOpacity
          onPress={() => {
            router.push('/(seller)/ai-chatbot');
          }}
          className="flex-row items-center p-4 rounded-3xl mb-4"
          style={{ 
            backgroundColor: '#E8F3E0',
            borderWidth: 1,
            borderColor: '#2C4A34',
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: '#2C4A34',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16,
            }}
          >
            <Bot size={28} stroke="#E8F3E0" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
              AI Plant Assistant
            </Text>
            <Text className="text-sm" style={{ color: '#6b7280', fontFamily: 'System' }}>
              Ask tips and tricks about plants
          </Text>
          </View>
        </TouchableOpacity>

        {/* Search Bar */}
        <View
          className="flex-row items-center px-4 rounded-2xl mb-4"
          style={{ backgroundColor: '#E8F3E0', borderWidth: 1, borderColor: '#2C4A34', height: 50 }}
        >
          <Search size={20} stroke="#2C4A34" style={{ marginRight: 12 }} />
          <TextInput
            placeholder="Search for a plant..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1"
            style={{ color: '#2C4A34', fontFamily: 'System' }}
            placeholderTextColor="#6b7280"
          />
        </View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              className="px-6 py-2 rounded-full mr-3"
              style={{
                backgroundColor: selectedCategory === category ? '#2C4A34' : '#365441',
                borderWidth: 1,
                borderColor: selectedCategory === category ? '#2C4A34' : '#2C4A34',
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{
                  color: selectedCategory === category ? '#E8F3E0' : '#E8F3E0',
                  fontFamily: 'System',
                }}
              >
                {category}
        </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Plant Grid */}
        <FlatList
          data={filteredPlants}
          renderItem={renderPlantCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{ marginBottom: 8 }}
        />
      </ScrollView>
      </View>
    </View>
  );
}

