import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  seller: mongoose.Types.ObjectId;
  name: string;
  description: string;
  category: 'Fruits' | 'Vegetables' | 'Mix';
  price: number; // in RM, 0 for free gifts
  imageUrl: string;
  status: 'to-ship' | 'delivered' | 'cancelled';
  deliveryMethod: 'Doorstep' | 'Hub Collect' | 'Self Pick-Up';
  bestBefore?: Date;
  imperfectLevel: number; // 0-100 percentage
  likelyContents: Array<{
    label: string;
    percent: number;
  }>;
  location?: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['Fruits', 'Vegetables', 'Mix'], required: true },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ['to-ship', 'delivered', 'cancelled'],
      default: 'to-ship',
    },
    deliveryMethod: {
      type: String,
      enum: ['Doorstep', 'Hub Collect', 'Self Pick-Up'],
      required: true,
    },
    bestBefore: { type: Date },
    imperfectLevel: { type: Number, min: 0, max: 100, default: 50 },
    likelyContents: [
      {
        label: { type: String, required: true },
        percent: { type: Number, min: 0, max: 100, required: true },
      },
    ],
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
  },
  { timestamps: true }
);

// Index for location-based queries
ProductSchema.index({ location: '2dsphere' });
ProductSchema.index({ seller: 1, status: 1 });
ProductSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model<IProduct>('Product', ProductSchema);

