import mongoose, { Document, Schema } from 'mongoose';

export interface IRating extends Document {
  order: mongoose.Types.ObjectId;
  rater: mongoose.Types.ObjectId; // Buyer or Seller who is rating
  rated: mongoose.Types.ObjectId; // User being rated (Seller or Buyer)
  stars: number; // 1-5
  experience: 'shy-seedling' | 'friendly-sprout' | 'jolly-pumpkin';
  foodQuality: number; // 0-100 slider (Wilted to Crisp)
  pickupEase: number; // 0-100 slider (Bumpy Path to Smooth Sailing)
  feedback?: string;
  createdAt: Date;
}

const RatingSchema = new Schema<IRating>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    rater: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rated: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    experience: {
      type: String,
      enum: ['shy-seedling', 'friendly-sprout', 'jolly-pumpkin'],
      required: true,
    },
    foodQuality: { type: Number, required: true, min: 0, max: 100 },
    pickupEase: { type: Number, required: true, min: 0, max: 100 },
    feedback: { type: String },
  },
  { timestamps: true }
);

RatingSchema.index({ rated: 1, createdAt: -1 });
RatingSchema.index({ order: 1 }, { unique: true });

export default mongoose.model<IRating>('Rating', RatingSchema);

