import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, FlatList, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Sun, Sprout, Droplet, Layers, Leaf, Bug } from 'lucide-react-native';
import '../../../global.css';

// TODO: Replace with API call
const GUIDE_DATA: Record<string, {
  name: string;
  imageUrl: string;
  sections: Array<{
    id: string;
    title: string;
    icon: any;
    iconColor: string;
    description: string;
  }>;
}> = {
  '1': {
    name: 'Kangkung',
    imageUrl: 'https://live.staticflickr.com/2826/12166793135_a1a896d781_b.jpg',
    sections: [
      {
        id: '1',
        title: 'Growing Tips',
        icon: Sun,
        iconColor: '#2C4A34',
        description: 'Full sun to partial shade. Grows well in water or moist soil.',
      },
      {
        id: '2',
        title: 'Planting Season',
        icon: Sprout,
        iconColor: '#2C4A34',
        description: 'Year-round in Sarawak. Best during rainy season.',
      },
      {
        id: '3',
        title: 'Watering',
        icon: Droplet,
        iconColor: '#2C4A34',
        description: 'Keep soil consistently moist. Can grow in shallow water.',
      },
      {
        id: '4',
        title: 'Soil Requirements',
        icon: Layers,
        iconColor: '#2C4A34',
        description: 'Rich, loamy soil. pH 6.0-7.0. Prefers wet conditions.',
      },
      {
        id: '5',
        title: 'Harvesting',
        icon: Leaf,
        iconColor: '#2C4A34',
        description: 'Harvest young shoots 3-4 weeks after planting.',
      },
      {
        id: '6',
        title: 'Common Issues',
        icon: Bug,
        iconColor: '#C85E51',
        description: 'Aphids, leaf miners. Ensure good drainage.',
      },
    ],
  },
  '2': {
    name: 'Paku',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7IcJNso-RE0NHqs8bveERq5euwKvtJSmrlw&s',
    sections: [
      {
        id: '1',
        title: 'Growing Tips',
        icon: Sun,
        iconColor: '#2C4A34',
        description: 'Partial to full shade. Prefers cool, humid conditions.',
      },
      {
        id: '2',
        title: 'Planting Season',
        icon: Sprout,
        iconColor: '#2C4A34',
        description: 'Year-round. Best during monsoon season.',
      },
      {
        id: '3',
        title: 'Watering',
        icon: Droplet,
        iconColor: '#2C4A34',
        description: 'Keep soil moist but well-drained. High humidity preferred.',
      },
      {
        id: '4',
        title: 'Soil Requirements',
        icon: Layers,
        iconColor: '#2C4A34',
        description: 'Rich, organic soil. pH 5.5-6.5. Well-drained.',
      },
      {
        id: '5',
        title: 'Harvesting',
        icon: Leaf,
        iconColor: '#2C4A34',
        description: 'Harvest young fronds (fiddleheads) when tightly coiled.',
      },
      {
        id: '6',
        title: 'Common Issues',
        icon: Bug,
        iconColor: '#C85E51',
        description: 'Slugs, snails. Avoid waterlogged soil.',
      },
    ],
  },
  '3': {
    name: 'Durian',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7R6riQWgGlRXbCwYfNv0jkAO2T_pu299ugA&s',
    sections: [
      {
        id: '1',
        title: 'Growing Tips',
        icon: Sun,
        iconColor: '#2C4A34',
        description: 'Full sun. Large tree, needs space. 5-10 years to fruit.',
      },
      {
        id: '2',
        title: 'Planting Season',
        icon: Sprout,
        iconColor: '#2C4A34',
        description: 'Plant during rainy season. Best in early monsoon.',
      },
      {
        id: '3',
        title: 'Watering',
        icon: Droplet,
        iconColor: '#2C4A34',
        description: 'Regular watering when young. Mature trees are drought tolerant.',
      },
      {
        id: '4',
        title: 'Soil Requirements',
        icon: Layers,
        iconColor: '#2C4A34',
        description: 'Deep, well-drained soil. pH 5.0-6.5. Rich in organic matter.',
      },
      {
        id: '5',
        title: 'Harvesting',
        icon: Leaf,
        iconColor: '#2C4A34',
        description: 'Harvest when fruit naturally falls or when ripe (3-4 months).',
      },
      {
        id: '6',
        title: 'Common Issues',
        icon: Bug,
        iconColor: '#C85E51',
        description: 'Fruit borers, stem canker. Requires proper pruning.',
      },
    ],
  },
  '4': {
    name: 'Rambutan',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKhvSaTPtcqJWiPBgjyxLqQjLLpDW-5uz1jw&s',
    sections: [
      {
        id: '1',
        title: 'Growing Tips',
        icon: Sun,
        iconColor: '#2C4A34',
        description: 'Full sun. Medium-sized tree. 3-5 years to fruit.',
      },
      {
        id: '2',
        title: 'Planting Season',
        icon: Sprout,
        iconColor: '#2C4A34',
        description: 'Plant during rainy season. Best in early monsoon.',
      },
      {
        id: '3',
        title: 'Watering',
        icon: Droplet,
        iconColor: '#2C4A34',
        description: 'Regular watering, especially during dry periods.',
      },
      {
        id: '4',
        title: 'Soil Requirements',
        icon: Layers,
        iconColor: '#2C4A34',
        description: 'Well-drained, fertile soil. pH 5.5-6.5. Avoid waterlogging.',
      },
      {
        id: '5',
        title: 'Harvesting',
        icon: Leaf,
        iconColor: '#2C4A34',
        description: 'Harvest when skin turns red/yellow. 3-4 months after flowering.',
      },
      {
        id: '6',
        title: 'Common Issues',
        icon: Bug,
        iconColor: '#C85E51',
        description: 'Fruit flies, mealybugs. Regular monitoring needed.',
      },
    ],
  },
  '5': {
    name: 'Pandan',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPWyp-ZSz15l4185S-MRo6OyWS8dHiIbk3aA&s',
    sections: [
      {
        id: '1',
        title: 'Growing Tips',
        icon: Sun,
        iconColor: '#2C4A34',
        description: 'Partial shade to full sun. Grows in clumps. Low maintenance.',
      },
      {
        id: '2',
        title: 'Planting Season',
        icon: Sprout,
        iconColor: '#2C4A34',
        description: 'Year-round. Best during rainy season.',
      },
      {
        id: '3',
        title: 'Watering',
        icon: Droplet,
        iconColor: '#2C4A34',
        description: 'Keep soil moist. Can tolerate wet conditions.',
      },
      {
        id: '4',
        title: 'Soil Requirements',
        icon: Layers,
        iconColor: '#2C4A34',
        description: 'Well-drained, fertile soil. pH 5.5-7.0. Prefers organic matter.',
      },
      {
        id: '5',
        title: 'Harvesting',
        icon: Leaf,
        iconColor: '#2C4A34',
        description: 'Harvest mature leaves from base. Can harvest year-round.',
      },
      {
        id: '6',
        title: 'Common Issues',
        icon: Bug,
        iconColor: '#C85E51',
        description: 'Minimal pests. Root rot if overwatered.',
      },
    ],
  },
  '6': {
    name: 'Serai',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/YosriNov04Pokok_Serai.JPG',
    sections: [
      {
        id: '1',
        title: 'Growing Tips',
        icon: Sun,
        iconColor: '#2C4A34',
        description: 'Full sun. Grows in clumps. Easy to propagate from stalks.',
      },
      {
        id: '2',
        title: 'Planting Season',
        icon: Sprout,
        iconColor: '#2C4A34',
        description: 'Year-round. Best during rainy season.',
      },
      {
        id: '3',
        title: 'Watering',
        icon: Droplet,
        iconColor: '#2C4A34',
        description: 'Keep soil consistently moist. Avoid waterlogging.',
      },
      {
        id: '4',
        title: 'Soil Requirements',
        icon: Layers,
        iconColor: '#2C4A34',
        description: 'Well-drained, fertile soil. pH 5.5-7.5. Prefers sandy loam.',
      },
      {
        id: '5',
        title: 'Harvesting',
        icon: Leaf,
        iconColor: '#2C4A34',
        description: 'Harvest stalks when 30-40cm tall. Cut at base.',
      },
      {
        id: '6',
        title: 'Common Issues',
        icon: Bug,
        iconColor: '#C85E51',
        description: 'Minimal pests. Rust disease in humid conditions.',
      },
    ],
  },
};

export default function PlantGuideScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // TODO: Replace with API call to fetch guide by ID
  const guide = GUIDE_DATA[id || '1'] || GUIDE_DATA['1'];

  const renderGuideSection = ({ item }: { item: typeof guide.sections[0] }) => {
    const IconComponent = item.icon;
    return (
      <View
        className="flex-row items-start p-4 rounded-3xl mb-3"
        style={{ backgroundColor: '#E8F3E0', borderWidth: 1, borderColor: '#2C4A34' }}
      >
        {/* Icon */}
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: '#2C4A34',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <IconComponent size={24} stroke="#E8F3E0" />
        </View>

        {/* Content */}
        <View className="flex-1">
          <Text className="text-base font-bold mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
            {item.title}
          </Text>
          <Text className="text-sm" style={{ color: '#2C4A34', fontFamily: 'System' }}>
            {item.description}
          </Text>
        </View>
      </View>
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
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} stroke="#ffffff" />
        </TouchableOpacity>
        <Text className="text-xl font-bold flex-1 text-center" style={{ color: '#ffffff', fontFamily: 'System' }}>
          {guide.name} Guide
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Plant Image */}
        <View
          className="items-center justify-center rounded-3xl mb-6 overflow-hidden"
          style={{ backgroundColor: '#E8F3E0', borderWidth: 1, borderColor: '#2C4A34', minHeight: 200 }}
        >
          {guide.imageUrl ? (
            <Image
              source={{ uri: guide.imageUrl }}
              style={{ width: '100%', height: 200 }}
              resizeMode="cover"
            />
          ) : (
            <View className="items-center justify-center" style={{ height: 200 }}>
              <Text className="text-base" style={{ color: '#6b7280', fontFamily: 'System' }}>
                Image coming soon
              </Text>
            </View>
          )}
        </View>

        {/* Guide Sections */}
        <FlatList
          data={guide.sections}
          renderItem={renderGuideSection}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  );
}

