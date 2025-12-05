import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: 'order' | 'product' | 'reward' | 'favorite' | 'badge' | 'mission' | 'points' | 'chat';
  title: string;
  message: string;
  imageUrl?: string;
  link?: string; // Route to navigate to
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['order', 'product', 'reward', 'favorite', 'badge', 'mission', 'points', 'chat'],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    imageUrl: { type: String },
    link: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

NotificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);

