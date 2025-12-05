import mongoose, { Document, Schema } from 'mongoose';

export interface IGuide extends Document {
  title: string;
  description: string;
  content: string;
  category: 'Vegetables' | 'Fruits' | 'Packaging' | 'Business';
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GuideSchema = new Schema<IGuide>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['Vegetables', 'Fruits', 'Packaging', 'Business'],
      required: true,
    },
    imageUrl: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

GuideSchema.index({ category: 1, isActive: 1 });

export default mongoose.model<IGuide>('Guide', GuideSchema);

