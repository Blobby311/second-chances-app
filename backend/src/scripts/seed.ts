import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Badge } from '../models/Badge';
import { Mission } from '../models/Mission';
import Reward from '../models/Reward';
import Guide from '../models/Guide';
import { connectDB } from '../config/database';

dotenv.config();

const seedBadges = async () => {
  const badges = [
    // Buyer badges
    { name: 'Loyal', icon: 'loyal.png', description: 'Place 10 orders', category: 'buyer', criteria: { type: 'orders', value: 10 } },
    { name: 'Regular', icon: 'regular.png', description: 'Place 5 orders', category: 'buyer', criteria: { type: 'orders', value: 5 } },
    { name: 'Eco Hero', icon: 'eco-hero.png', description: 'Rescue 20 boxes', category: 'buyer', criteria: { type: 'orders', value: 20 } },
    { name: 'Early Bird', icon: 'early.png', description: 'Place first order', category: 'buyer', criteria: { type: 'orders', value: 1 } },
    { name: 'Reviewer', icon: 'reviewer.png', description: 'Leave 5 reviews', category: 'buyer', criteria: { type: 'ratings', value: 5 } },
    { name: 'Gold', icon: 'gold.png', description: 'Earn 1000 points', category: 'buyer', criteria: { type: 'points', value: 1000 } },
    { name: 'Quick', icon: 'quick.png', description: 'Complete 3 orders in a week', category: 'buyer', criteria: { type: 'orders', value: 3 } },
    { name: 'Fast', icon: 'fast.png', description: 'Complete 10 orders', category: 'buyer', criteria: { type: 'orders', value: 10 } },
    { name: 'Weekly', icon: 'weekly.png', description: 'Complete weekly mission', category: 'buyer', criteria: { type: 'missions', value: 1 } },
    { name: 'Champion', icon: 'champion.png', description: 'Top contributor', category: 'buyer', criteria: { type: 'orders', value: 50 } },
    { name: 'Eco Warrior', icon: 'eco-warrior.png', description: 'Rescue 50 boxes', category: 'buyer', criteria: { type: 'orders', value: 50 } },
    
    // Seller badges
    { name: 'Builder', icon: 'builder.png', description: 'List 10 products', category: 'seller', criteria: { type: 'products', value: 10 } },
    { name: 'Giver', icon: 'giver.png', description: 'Share 20 boxes', category: 'seller', criteria: { type: 'orders', value: 20 } },
    { name: 'Hero', icon: 'hero.png', description: 'Share 50 boxes', category: 'seller', criteria: { type: 'orders', value: 50 } },
    { name: 'Trusted', icon: 'trusted.png', description: 'Get 10 positive reviews', category: 'seller', criteria: { type: 'ratings', value: 10 } },
  ];

  for (const badge of badges) {
    await Badge.findOneAndUpdate({ name: badge.name }, badge, { upsert: true, new: true });
  }
  console.log('Badges seeded');
};

const seedMissions = async () => {
  const missions = [
    // Daily missions
    { name: 'Place Order', description: 'Place an order today', type: 'daily', points: 50, criteria: { type: 'place-order', value: 1 }, isActive: true },
    { name: 'Leave Review', description: 'Leave a review for your order', type: 'daily', points: 30, criteria: { type: 'leave-review', value: 1 }, isActive: true },
    { name: 'Browse Products', description: 'Browse 5 products', type: 'daily', points: 20, criteria: { type: 'browse-products', value: 5 }, isActive: true },
    
    // Weekly missions
    { name: 'Complete Orders', description: 'Complete 3 orders this week', type: 'weekly', points: 100, criteria: { type: 'complete-orders', value: 3 }, isActive: true },
    { name: 'Rescue Boxes', description: 'Rescue 5 boxes this week', type: 'weekly', points: 150, criteria: { type: 'rescue-boxes', value: 5 }, isActive: true },
    { name: 'Refer Friend', description: 'Refer a friend this week', type: 'weekly', points: 200, criteria: { type: 'refer-friend', value: 1 }, isActive: true },
  ];

  for (const mission of missions) {
    await Mission.findOneAndUpdate({ name: mission.name, type: mission.type }, mission, { upsert: true, new: true });
  }
  console.log('Missions seeded');
};

const seedRewards = async () => {
  const rewards = [
    { name: 'Free Delivery', description: 'Get free delivery on your next order', discount: 5, pointsCost: 100, type: 'free-delivery', isActive: true },
    { name: '10% Discount', description: 'Get 10% off your next order', discount: 10, pointsCost: 200, type: 'discount', isActive: true },
    { name: 'Free Box', description: 'Get a free box', discount: 10, pointsCost: 500, type: 'free-box', isActive: true },
  ];

  for (const reward of rewards) {
    await Reward.findOneAndUpdate({ name: reward.name }, reward, { upsert: true, new: true });
  }
  console.log('Rewards seeded');
};

const seedGuides = async () => {
  const guides = [
    {
      title: 'Growing Vegetables at Home',
      description: 'Learn how to grow fresh vegetables in your garden',
      content: 'Complete guide to growing vegetables...',
      category: 'Vegetables',
      isActive: true,
    },
    {
      title: 'Fruit Tree Care',
      description: 'Tips for maintaining healthy fruit trees',
      content: 'Fruit tree care guide...',
      category: 'Fruits',
      isActive: true,
    },
    {
      title: 'Sustainable Packaging',
      description: 'Eco-friendly packaging solutions',
      content: 'Packaging guide...',
      category: 'Packaging',
      isActive: true,
    },
    {
      title: 'Starting Your Business',
      description: 'Guide to starting a food rescue business',
      content: 'Business guide...',
      category: 'Business',
      isActive: true,
    },
  ];

  for (const guide of guides) {
    await Guide.findOneAndUpdate({ title: guide.title }, guide, { upsert: true, new: true });
  }
  console.log('Guides seeded');
};

const seed = async () => {
  try {
    await connectDB();
    await seedBadges();
    await seedMissions();
    await seedRewards();
    await seedGuides();
    console.log('Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();

