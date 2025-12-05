import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Alert, Image, TextInput, PanResponder, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Star, ArrowLeft } from 'lucide-react-native';
import '../../global.css';

// TODO: Replace with API call to get seller info from order
const SELLER_DATA = {
  id: 's1',
  name: 'Uncle Roger',
  avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa3du6j726GP7-rDxHda8-FYopWptm3LsTWA&s',
};

type SliderProps = {
  value: number;
  onChange: (value: number) => void;
  leftLabel: string;
  rightLabel: string;
};

const RatingSlider = ({ value, onChange, leftLabel, rightLabel }: SliderProps) => {
  const [trackLayout, setTrackLayout] = useState({ width: 0 });
  const startXRef = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        if (trackLayout.width > 0) {
          startXRef.current = evt.nativeEvent.locationX;
          const ratio = Math.max(0, Math.min(1, evt.nativeEvent.locationX / trackLayout.width));
          onChange(Math.round(ratio * 100));
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (trackLayout.width > 0) {
          const currentX = startXRef.current + gestureState.dx;
          const ratio = Math.max(0, Math.min(1, currentX / trackLayout.width));
          onChange(Math.round(ratio * 100));
        }
      },
    })
  ).current;

  const thumbLeft = trackLayout.width > 0 ? Math.max(0, Math.min((value / 100) * trackLayout.width - 12, trackLayout.width - 24)) : 0;

  return (
    <View>
      <View
        onLayout={(e) => {
          const { width } = e.nativeEvent.layout;
          setTrackLayout({ width });
        }}
        style={{
          height: 50,
          justifyContent: 'center',
          position: 'relative',
          marginBottom: 8,
        }}
      >
        {/* Track background */}
        <View
          style={{
            height: 8,
            backgroundColor: '#ffffff',
            borderRadius: 4,
            position: 'absolute',
            left: 0,
            right: 0,
          }}
        />
        {/* Filled track */}
        <View
          style={{
            height: 8,
            backgroundColor: '#2C4A34',
            borderRadius: 4,
            position: 'absolute',
            left: 0,
            right: 0,
            width: `${value}%`,
          }}
        />
        {/* Draggable thumb */}
        <View
          {...panResponder.panHandlers}
          style={{
            position: 'absolute',
            left: thumbLeft,
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: '#C85E51',
            borderWidth: 2,
            borderColor: '#2C4A34',
            top: 13,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 4,
          }}
        />
        {/* Invisible touch area for entire track */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => {
            if (trackLayout.width > 0) {
              const touchX = e.nativeEvent.locationX;
              const ratio = Math.max(0, Math.min(1, touchX / trackLayout.width));
              onChange(Math.round(ratio * 100));
            }
          }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            height: 50,
          }}
        />
      </View>
      <View className="flex-row justify-between">
        <Text className="text-xs" style={{ color: '#2C4A34', fontFamily: 'System' }}>
          {leftLabel}
        </Text>
        <Text className="text-xs" style={{ color: '#2C4A34', fontFamily: 'System' }}>
          {rightLabel}
        </Text>
      </View>
    </View>
  );
};

type EmojiOption = {
  id: string;
  emoji: string;
  label: string;
};

const EmojiSelector = ({
  options,
  selectedId,
  onSelect,
}: {
  options: EmojiOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}) => {
  return (
    <View className="flex-row justify-between">
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          onPress={() => onSelect(option.id)}
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 8,
            borderRadius: 16,
            backgroundColor: selectedId === option.id ? '#2C4A34' : '#ffffff',
            borderWidth: 1,
            borderColor: '#2C4A34',
            marginHorizontal: 4,
          }}
        >
          <Text className="text-3xl mb-2">{option.emoji}</Text>
          <Text 
            className="text-xs text-center" 
            style={{ 
              color: selectedId === option.id ? '#E8F3E0' : '#2C4A34', 
              fontFamily: 'System' 
            }}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function RatingScreen() {
  const { orderId, sellerId } = useLocalSearchParams<{ orderId?: string; sellerId?: string }>();
  const router = useRouter();
  const [starRating, setStarRating] = useState(5);
  const [experience, setExperience] = useState('jolly');
  const [crispness, setCrispness] = useState(85);
  const [pickupEase, setPickupEase] = useState(95);
  const [feedback, setFeedback] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const seller = SELLER_DATA;

  const experienceOptions: EmojiOption[] = [
    { id: 'shy', emoji: '😔', label: 'Shy Seedling' },
    { id: 'friendly', emoji: '😊', label: 'Friendly Sprout' },
    { id: 'jolly', emoji: '😄', label: 'Jolly Pumpkin' },
  ];

  const handleSubmit = () => {
    Alert.alert('Thank you!', 'Your feedback has been recorded. Seeds earned!', [
      { text: 'Done', onPress: () => router.replace('/(buyer)/home') },
    ]);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: '#365441' }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="flex-row items-center px-4" style={{ backgroundColor: '#2C4A34', paddingTop: 60, paddingBottom: 12 }}>
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} stroke="#ffffff" />
        </TouchableOpacity>
        <Text className="text-xl font-bold flex-1 text-center" style={{ color: '#ffffff', fontFamily: 'System' }}>
          Rate Your Experience
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Main Card */}
          <View
            style={{
              backgroundColor: '#E8F3E0',
              borderRadius: 24,
              padding: 20,
              borderWidth: 1,
              borderColor: '#2C4A34',
            }}
          >
            {/* Title */}
            <Text className="text-2xl font-bold mb-4 text-center" style={{ color: '#2C4A34', fontFamily: 'System' }}>
              Hooray! Order Complete
            </Text>

            {/* Seller Profile */}
            <View className="items-center mb-4">
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  overflow: 'hidden',
                  marginBottom: 8,
                  backgroundColor: '#E8F3E0',
                }}
              >
                {seller.avatar ? (
                  <Image source={{ uri: seller.avatar }} style={{ width: '100%', height: '100%' }} />
                ) : (
                  <View className="items-center justify-center" style={{ width: '100%', height: '100%' }}>
                    <Text className="text-xl font-bold" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                      {seller.name[0]}
                    </Text>
                  </View>
                )}
              </View>
              <Text className="text-lg font-bold mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                {seller.name}
              </Text>
              <Text className="text-xs" style={{ color: '#647067', fontFamily: 'System' }}>
                for rating
              </Text>
            </View>

            {/* Star Rating */}
            <View className="flex-row justify-center mb-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setStarRating(idx + 1)}
                  style={{ marginHorizontal: 3 }}
                  activeOpacity={0.7}
                >
                  <Star
                    size={28}
                    stroke="#facc15"
                    strokeWidth={idx < starRating ? 0 : 2}
                    fill={idx < starRating ? '#facc15' : 'transparent'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* The Exchange (Experience) - FIRST */}
            <View className="mb-3">
              <Text className="text-base font-bold mb-3" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                The Exchange (Experience)
              </Text>
              <EmojiSelector
                options={experienceOptions}
                selectedId={experience}
                onSelect={setExperience}
              />
            </View>

            {/* The Harvest (Food) - SECOND */}
            <View className="mb-3">
              <Text className="text-base font-bold mb-3" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                The Harvest (Food)
              </Text>
              <RatingSlider
                value={crispness}
                onChange={setCrispness}
                leftLabel="Wilted"
                rightLabel="Crisp"
              />
            </View>

            {/* Pickup Ease - THIRD */}
            <View className="mb-3">
              <Text className="text-base font-bold mb-3" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                Pickup Ease
              </Text>
              <RatingSlider
                value={pickupEase}
                onChange={setPickupEase}
                leftLabel="Bumpy Path"
                rightLabel="Smooth Sailing"
              />
            </View>

            {/* Feedback Section */}
            <View className="mb-4">
              <Text className="text-base font-bold mb-2" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                Feedback
              </Text>
              <TextInput
                ref={inputRef}
                placeholder="Share your thoughts..."
                placeholderTextColor="#94a3b8"
                value={feedback}
                onChangeText={setFeedback}
                multiline
                numberOfLines={3}
                onFocus={() => {
                  setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({ animated: true });
                  }, 300);
                }}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 12,
                  padding: 12,
                  minHeight: 80,
                  textAlignVertical: 'top',
                  color: '#2C4A34',
                  fontFamily: 'System',
                  fontSize: 14,
                  borderWidth: 1,
                  borderColor: '#2C4A34',
                }}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className="py-3 rounded-3xl items-center"
              style={{
                backgroundColor: '#C85E51',
              }}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Text className="text-white text-base font-bold" style={{ fontFamily: 'System' }}>
                Submit & Earn Points
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

