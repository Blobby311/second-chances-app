import mongoose, { Document, Schema } from 'mongoose';

export interface IPointsTransaction extends Document {
  user: mongoose.Types.ObjectId;
  amount: number; // Positive for earning, negative for spending
  type: 'earn' | 'deduct' | 'expire';
  source: string; // 'rating', 'mission', 'referral', 'checkout', etc.
  description: string;
  expiresAt?: Date;
  createdAt: Date;
}

const PointsTransactionSchema = new Schema<IPointsTransaction>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['earn', 'deduct', 'expire'], required: true },
    source: { type: String, required: true },
    description: { type: String, required: true },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

PointsTransactionSchema.index({ user: 1, createdAt: -1 });
PointsTransactionSchema.index({ expiresAt: 1 });

export default mongoose.model<IPointsTransaction>('PointsTransaction', PointsTransactionSchema);

