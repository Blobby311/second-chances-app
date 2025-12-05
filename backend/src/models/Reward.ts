import mongoose, { Document, Schema } from 'mongoose';

export interface IReward extends Document {
  name: string;
  description: string;
  discount: number; // Percentage or fixed amount
  pointsCost: number;
  type: 'free-delivery' | 'discount' | 'free-box';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RewardSchema = new Schema<IReward>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    discount: { type: Number, required: true, min: 0 },
    pointsCost: { type: Number, required: true, min: 0 },
    type: {
      type: String,
      enum: ['free-delivery', 'discount', 'free-box'],
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IReward>('Reward', RewardSchema);

