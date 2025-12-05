import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar, ScrollView, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, CheckCircle } from 'lucide-react-native';
import '../../global.css';

// Badge image mapping - static requires for React Native
const BADGE_IMAGES: { [key: string]: any } = {
  'loyal.png': require('../../assets/badges/loyal.png'),
  'regular.png': require('../../assets/badges/regular.png'),
  'eco-hero.png': require('../../assets/badges/eco-hero.png'),
  'early.png': require('../../assets/badges/early.png'),
  'reviewer.png': require('../../assets/badges/reviewer.png'),
  'gold.png': require('../../assets/badges/gold.png'),
  'quick.png': require('../../assets/badges/quick.png'),
  'builder.png': require('../../assets/badges/builder.png'),
};

// TODO: Replace with API call
const BUYER_BADGES = [
  {
    id: 'loyal',
    name: 'Loyal',
    description: '10+ orders placed',
    image: 'loyal.png',
    isEarned: true,
    requirement: '10+ orders',
    currentProgress: 10,
    requiredProgress: 10,
  },
  {
    id: 'regular',
    name: 'Regular',
    description: '5+ orders in a month',
    image: 'regular.png',
    isEarned: true,
    requirement: '5+ orders/month',
    currentProgress: 5,
    requiredProgress: 5,
  },
  {
    id: 'eco-hero',
    name: 'Eco Hero',
    description: 'Rescued 20+ boxes',
    image: 'eco-hero.png',
    isEarned: true,
    requirement: '20+ boxes rescued',
    currentProgress: 20,
    requiredProgress: 20,
  },
  {
    id: 'early-supporter',
    name: 'Early Supporter',
    description: 'Joined in first month',
    image: 'early.png',
    isEarned: false,
    requirement: 'Joined in first month',
    currentProgress: 0,
    requiredProgress: 1,
  },
  {
    id: 'reviewer',
    name: 'Reviewer',
    description: 'Left 10+ reviews',
    image: 'reviewer.png',
    isEarned: false,
    requirement: '10+ reviews',
    currentProgress: 6,
    requiredProgress: 10,
  },
  {
    id: 'gold-member',
    name: 'Gold Member',
    description: '50+ orders placed',
    image: 'gold.png',
    isEarned: false,
    requirement: '50+ orders',
    isPrestige: true,
    currentProgress: 28,
    requiredProgress: 50,
  },
  {
    id: 'quick-buyer',
    name: 'Quick Buyer',
    description: 'Completed order within 1 hour',
    image: 'quick.png',
    isEarned: false,
    requirement: 'Order in 1 hour',
    currentProgress: 0,
    requiredProgress: 1,
  },
  {
    id: 'community-builder',
    name: 'Community Builder',
    description: 'Referred 5+ friends',
    image: 'builder.png',
    isEarned: false,
    requirement: '5+ referrals',
    currentProgress: 2,
    requiredProgress: 5,
  },
];

// TODO: Replace with API call
const DAILY_MISSIONS = [
  {
    id: 'daily-1',
    title: 'Place an Order',
    description: 'Order any veggie box today',
    points: 50,
    isCompleted: false,
    progress: 0,
    required: 1,
  },
  {
    id: 'daily-2',
    title: 'Leave a Review',
    description: 'Review your last purchase',
    points: 30,
    isCompleted: false,
    progress: 0,
    required: 1,
  },
  {
    id: 'daily-3',
    title: 'Browse Products',
    description: 'View 5 different products',
    points: 20,
    isCompleted: true,
    progress: 5,
    required: 5,
  },
];

// TODO: Replace with API call
const WEEKLY_MISSIONS = [
  {
    id: 'weekly-1',
    title: 'Complete 3 Orders',
    description: 'Place and complete 3 orders this week',
    points: 150,
    isCompleted: false,
    progress: 2,
    required: 3,
  },
  {
    id: 'weekly-2',
    title: 'Rescue 5 Boxes',
    description: 'Rescue 5 veggie boxes this week',
    points: 200,
    isCompleted: false,
    progress: 3,
    required: 5,
  },
  {
    id: 'weekly-3',
    title: 'Refer a Friend',
    description: 'Get a friend to join Second Chances',
    points: 100,
    isCompleted: false,
    progress: 0,
    required: 1,
  },
];

const REWARDS_DATA = [
  { id: '1', title: 'Free Delivery', points: 100, description: 'Get free delivery on your next order', isClaimed: false },
  { id: '2', title: '10% Discount', points: 200, description: 'Save 10% on your next purchase', isClaimed: false },
  { id: '3', title: '15% Discount', points: 300, description: 'Save 15% on your next purchase', isClaimed: false },
  { id: '4', title: 'Free Veggie Box', points: 500, description: 'Get a free veggie box worth RM10', isClaimed: true },
  { id: '5', title: '20% Discount', points: 400, description: 'Save 20% on your next purchase', isClaimed: false },
];

// TODO: Replace with API call
const TOTAL_POINTS = 345;

export default function RewardsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'badges' | 'missions' | 'redeem'>('badges');
  const [userPoints, setUserPoints] = useState(TOTAL_POINTS);
  const [dailyMissions, setDailyMissions] = useState(DAILY_MISSIONS);
  const [weeklyMissions, setWeeklyMissions] = useState(WEEKLY_MISSIONS);

  const handleClaimMission = (mission: typeof DAILY_MISSIONS[0] | typeof WEEKLY_MISSIONS[0], type: 'daily' | 'weekly') => {
    if (mission.isCompleted) {
      Alert.alert('Already Claimed', 'You have already claimed points for this mission.');
      return;
    }

    if (mission.progress < mission.required) {
      Alert.alert('Mission Incomplete', `Complete the mission to earn ${mission.points} points!`);
      return;
    }

    Alert.alert(
      'Claim Points',
      `Claim ${mission.points} points for completing "${mission.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Claim',
          onPress: () => {
            // TODO: API call to claim mission points
            setUserPoints(userPoints + mission.points);
            if (type === 'daily') {
              setDailyMissions(dailyMissions.map(m => 
                m.id === mission.id ? { ...m, isCompleted: true } : m
              ));
            } else {
              setWeeklyMissions(weeklyMissions.map(m => 
                m.id === mission.id ? { ...m, isCompleted: true } : m
              ));
            }
            Alert.alert('Success!', `You earned ${mission.points} points!`);
          },
        },
      ]
    );
  };

  const handleRedeem = (item: typeof REWARDS_DATA[0]) => {
    if (item.isClaimed) {
      Alert.alert('Already Claimed', 'You have already claimed this reward.');
      return;
    }
    
    if (userPoints < item.points) {
      Alert.alert('Insufficient Points', `You need ${item.points} points to claim this reward.`);
      return;
    }

    Alert.alert(
      'Confirm Redemption',
      `Are you sure you want to redeem "${item.title}" for ${item.points} points?\n\nThis will be available at checkout.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            // TODO: API call to redeem reward - this should be available at checkout
            setUserPoints(userPoints - item.points);
            Alert.alert('Success!', `You have successfully redeemed "${item.title}"! You can use it at checkout.`);
          },
        },
      ]
    );
  };

  const earnedCount = BUYER_BADGES.filter(badge => badge.isEarned).length;
  const totalCount = BUYER_BADGES.length;

  return (
    <View className="flex-1" style={{ backgroundColor: '#365441' }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View
        className="px-4"
        style={{ backgroundColor: '#2C4A34', paddingTop: 60, paddingBottom: 16 }}
      >
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Menu size={24} stroke="#ffffff" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold" style={{ color: '#ffffff', fontFamily: 'System' }}>
              Rewards & Badges
            </Text>
          </View>
        </View>
      </View>

      {/* Total Points Display - Always Visible */}
      <View 
        className="px-4 py-3"
        style={{ backgroundColor: '#365441' }}
      >
        <View 
          className="p-3 rounded-2xl"
          style={{ 
            backgroundColor: '#E8F3E0',
            borderWidth: 1,
            borderColor: '#2C4A34',
          }}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-semibold mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                Total Points
              </Text>
              <Text className="text-2xl font-bold" style={{ color: '#C85E51', fontFamily: 'System' }}>
                {userPoints} pts
              </Text>
            </View>
            <Text className="text-xs" style={{ color: '#6b7280', fontFamily: 'System' }}>
              Use at checkout
            </Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row px-4 py-3" style={{ backgroundColor: '#365441' }}>
        <TouchableOpacity
          onPress={() => setActiveTab('badges')}
          className="flex-1 py-2 rounded-2xl mr-1"
          style={{
            backgroundColor: activeTab === 'badges' ? '#2C4A34' : '#E8F3E0',
          }}
        >
          <Text
            className="text-center font-bold text-sm"
            style={{
              color: activeTab === 'badges' ? '#ffffff' : '#2C4A34',
              fontFamily: 'System',
            }}
          >
            Badges
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('missions')}
          className="flex-1 py-2 rounded-2xl mx-1"
          style={{
            backgroundColor: activeTab === 'missions' ? '#2C4A34' : '#E8F3E0',
          }}
        >
          <Text
            className="text-center font-bold text-sm"
            style={{
              color: activeTab === 'missions' ? '#ffffff' : '#2C4A34',
              fontFamily: 'System',
            }}
          >
            Missions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('redeem')}
          className="flex-1 py-2 rounded-2xl ml-1"
          style={{
            backgroundColor: activeTab === 'redeem' ? '#2C4A34' : '#E8F3E0',
          }}
        >
          <Text
            className="text-center font-bold text-sm"
            style={{
              color: activeTab === 'redeem' ? '#ffffff' : '#2C4A34',
              fontFamily: 'System',
            }}
          >
            Redeem
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
      >
        {activeTab === 'badges' ? (
          <>
            {/* Badge Stats */}
            <View 
              className="p-4 rounded-3xl mb-4"
              style={{ 
                backgroundColor: '#E8F3E0',
                borderWidth: 1,
                borderColor: '#2C4A34',
              }}
            >
              <Text className="text-lg font-bold mb-2" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                Your Progress
              </Text>
              <Text className="text-3xl font-bold mb-1" style={{ color: '#16a34a', fontFamily: 'System' }}>
                {earnedCount} / {totalCount}
              </Text>
              <Text className="text-sm" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                Badges Earned
              </Text>
            </View>

            <Text className="text-lg font-bold mb-4" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
              All Badges
            </Text>
            
            {/* Render badges in rows manually instead of FlatList to avoid crash */}
            <View style={{ gap: 12 }}>
              {Array.from({ length: Math.ceil(BUYER_BADGES.length / 2) }).map((_, rowIndex) => (
                <View key={`row-${rowIndex}`} className="flex-row" style={{ gap: 12, justifyContent: 'space-between' }}>
                  {BUYER_BADGES.slice(rowIndex * 2, rowIndex * 2 + 2).map((item) => {
                    const badgeImage = item.image ? BADGE_IMAGES[item.image] : null;
                    const borderWidth = item.isPrestige ? 4 : 3;
                    
                    return (
                      <View
                        key={item.id}
                        className="items-center justify-center p-4 rounded-3xl"
                        style={{
                          backgroundColor: '#E8F3E0',
                          borderWidth: item.isEarned ? borderWidth : 1,
                          borderColor: item.isEarned ? '#2C4A34' : '#6b7280',
                          minHeight: 160,
                          width: '48%',
                          opacity: item.isEarned ? 1 : 0.6,
                        }}
                      >
                        {/* Badge Image in Circle */}
                        {badgeImage ? (
                          <View
                            style={{
                              width: 120,
                              height: 120,
                              borderRadius: 60,
                              borderWidth: borderWidth,
                              borderColor: item.isEarned ? '#2C4A34' : '#6b7280',
                              marginBottom: 12,
                              overflow: 'hidden',
                              backgroundColor: '#E8F3E0',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Image
                              source={badgeImage}
                              style={{
                                width: 120,
                                height: 120,
                                opacity: item.isEarned ? 1 : 0.5,
                              }}
                              resizeMode="contain"
                            />
                          </View>
                        ) : null}
                        
                        <Text
                          className="text-base font-bold text-center mb-1"
                          style={{
                            color: item.isEarned ? '#2C4A34' : '#6b7280',
                            fontFamily: 'System',
                          }}
                        >
                          {item.name}
                        </Text>
                        <Text
                          className="text-xs text-center mb-2"
                          style={{
                            color: item.isEarned ? '#2C4A34' : '#6b7280',
                            fontFamily: 'System',
                          }}
                        >
                          {item.description}
                        </Text>
                        {!item.isEarned && (
                          <>
                            {/* Progress Bar */}
                            <View
                              style={{
                                width: '100%',
                                height: 6,
                                backgroundColor: '#d1d5db',
                                borderRadius: 3,
                                overflow: 'hidden',
                                marginBottom: 4,
                              }}
                            >
                              <View
                                style={{
                                  width: `${Math.min((item.currentProgress / item.requiredProgress) * 100, 100)}%`,
                                  height: '100%',
                                  backgroundColor: '#16a34a',
                                  borderRadius: 3,
                                }}
                              />
                            </View>
                            <Text
                              className="text-xs text-center"
                              style={{
                                color: '#6b7280',
                                fontFamily: 'System',
                              }}
                            >
                              {item.currentProgress} / {item.requiredProgress}
                            </Text>
                          </>
                        )}
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          </>
        ) : activeTab === 'missions' ? (
          <>
            <Text className="text-lg font-bold mb-3" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
              Daily Missions
            </Text>
            {dailyMissions.map((item) => {
              const isComplete = item.progress >= item.required;
              const progressPercentage = Math.min((item.progress / item.required) * 100, 100);
              
              return (
                <View
                  key={item.id}
                  className="p-4 rounded-3xl mb-4"
                  style={{
                    backgroundColor: '#E8F3E0',
                    borderWidth: 1,
                    borderColor: '#2C4A34',
                  }}
                >
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1 mr-2">
                      <Text className="text-base font-bold mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                        {item.title}
                      </Text>
                      <Text className="text-sm mb-2" style={{ color: '#6b7280', fontFamily: 'System' }}>
                        {item.description}
                      </Text>
                      <Text className="text-sm font-bold" style={{ color: '#C85E51', fontFamily: 'System' }}>
                        +{item.points} points
                      </Text>
                    </View>
                    {item.isCompleted && (
                      <CheckCircle size={24} stroke="#16a34a" strokeWidth={2} />
                    )}
                  </View>

                  <View
                    style={{
                      width: '100%',
                      height: 6,
                      backgroundColor: '#d1d5db',
                      borderRadius: 3,
                      overflow: 'hidden',
                      marginBottom: 8,
                    }}
                  >
                    <View
                      style={{
                        width: `${progressPercentage}%`,
                        height: '100%',
                        backgroundColor: isComplete ? '#16a34a' : '#C85E51',
                        borderRadius: 3,
                      }}
                    />
                  </View>

                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs" style={{ color: '#6b7280', fontFamily: 'System' }}>
                      {item.progress} / {item.required}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleClaimMission(item, 'daily')}
                      className="px-4 py-2 rounded-2xl"
                      style={{
                        backgroundColor: item.isCompleted ? '#6b7280' : (isComplete ? '#C85E51' : '#9ca3af'),
                      }}
                      disabled={item.isCompleted || !isComplete}
                    >
                      <Text className="text-white text-xs font-bold" style={{ fontFamily: 'System' }}>
                        {item.isCompleted ? 'Claimed' : (isComplete ? 'Claim' : 'In Progress')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            <Text className="text-lg font-bold mb-3 mt-4" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
              Weekly Missions
            </Text>
            {weeklyMissions.map((item) => {
              const isComplete = item.progress >= item.required;
              const progressPercentage = Math.min((item.progress / item.required) * 100, 100);
              
              return (
                <View
                  key={item.id}
                  className="p-4 rounded-3xl mb-4"
                  style={{
                    backgroundColor: '#E8F3E0',
                    borderWidth: 1,
                    borderColor: '#2C4A34',
                  }}
                >
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1 mr-2">
                      <Text className="text-base font-bold mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                        {item.title}
                      </Text>
                      <Text className="text-sm mb-2" style={{ color: '#6b7280', fontFamily: 'System' }}>
                        {item.description}
                      </Text>
                      <Text className="text-sm font-bold" style={{ color: '#C85E51', fontFamily: 'System' }}>
                        +{item.points} points
                      </Text>
                    </View>
                    {item.isCompleted && (
                      <CheckCircle size={24} stroke="#16a34a" strokeWidth={2} />
                    )}
                  </View>

                  <View
                    style={{
                      width: '100%',
                      height: 6,
                      backgroundColor: '#d1d5db',
                      borderRadius: 3,
                      overflow: 'hidden',
                      marginBottom: 8,
                    }}
                  >
                    <View
                      style={{
                        width: `${progressPercentage}%`,
                        height: '100%',
                        backgroundColor: isComplete ? '#16a34a' : '#C85E51',
                        borderRadius: 3,
                      }}
                    />
                  </View>

                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs" style={{ color: '#6b7280', fontFamily: 'System' }}>
                      {item.progress} / {item.required}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleClaimMission(item, 'weekly')}
                      className="px-4 py-2 rounded-2xl"
                      style={{
                        backgroundColor: item.isCompleted ? '#6b7280' : (isComplete ? '#C85E51' : '#9ca3af'),
                      }}
                      disabled={item.isCompleted || !isComplete}
                    >
                      <Text className="text-white text-xs font-bold" style={{ fontFamily: 'System' }}>
                        {item.isCompleted ? 'Claimed' : (isComplete ? 'Claim' : 'In Progress')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </>
        ) : (
          <>
            <Text className="text-lg font-bold mb-4" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
              Available Rewards
            </Text>
            <Text className="text-sm mb-4" style={{ color: '#E8F3E0', fontFamily: 'System' }}>
              Redeem points for perks that can be used at checkout
            </Text>
            {REWARDS_DATA.map((item) => (
              <View
                key={item.id}
                className="p-4 rounded-3xl mb-4"
                style={{
                  backgroundColor: '#E8F3E0',
                  borderWidth: 1,
                  borderColor: '#2C4A34',
                }}
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 mr-4">
                    <Text className="text-base font-bold mb-1" style={{ color: '#2C4A34', fontFamily: 'System' }}>
                      {item.title}
                    </Text>
                    <Text className="text-sm mb-2" style={{ color: '#6b7280', fontFamily: 'System' }}>
                      {item.description}
                    </Text>
                    <Text className="text-sm font-bold" style={{ color: '#C85E51', fontFamily: 'System' }}>
                      {item.points} points
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleRedeem(item)}
                    className="px-6 py-3 rounded-3xl"
                    style={{
                      backgroundColor: item.isClaimed ? '#6b7280' : (userPoints >= item.points ? '#C85E51' : '#9ca3af'),
                      justifyContent: 'center',
                    }}
                    disabled={item.isClaimed || userPoints < item.points}
                  >
                    <Text className="text-white text-sm font-bold" style={{ fontFamily: 'System' }}>
                      {item.isClaimed ? 'Claimed' : 'Redeem'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}
