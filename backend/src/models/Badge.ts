import mongoose, { Document, Schema } from 'mongoose';

export interface IBadge extends Document {
  name: string;
  icon: string; // Filename like 'eco-hero.png'
  description: string;
  category: 'buyer' | 'seller' | 'both';
  criteria: {
    type: string; // 'orders', 'ratings', 'points', 'referrals', etc.
    value: number;
  };
}

export interface IUserBadge extends Document {
  user: mongoose.Types.ObjectId;
  badge: mongoose.Types.ObjectId;
  progress: number; // 0-100
  isEarned: boolean;
  isClaimed: boolean;
  earnedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BadgeSchema = new Schema<IBadge>(
  {
    name: { type: String, required: true, unique: true },
    icon: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['buyer', 'seller', 'both'], required: true },
    criteria: {
      type: { type: String, required: true },
      value: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

const UserBadgeSchema = new Schema<IUserBadge>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    badge: { type: Schema.Types.ObjectId, ref: 'Badge', required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    isEarned: { type: Boolean, default: false },
    isClaimed: { type: Boolean, default: false },
    earnedAt: { type: Date },
  },
  { timestamps: true }
);

UserBadgeSchema.index({ user: 1, badge: 1 }, { unique: true });

export const Badge = mongoose.model<IBadge>('Badge', BadgeSchema);
export default mongoose.model<IUserBadge>('UserBadge', UserBadgeSchema);

