import mongoose, { Document, Schema } from 'mongoose';

export interface IAIChatMessage extends Document {
  user: mongoose.Types.ObjectId;
  sender: 'user' | 'bot';
  content: string;
  role?: 'buyer' | 'seller'; // Separate conversations for buyer and seller
  createdAt: Date;
  updatedAt: Date;
}

const AIChatMessageSchema = new Schema<IAIChatMessage>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: String, enum: ['user', 'bot'], required: true },
    content: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'seller'] }, // Optional for backward compatibility
  },
  { timestamps: true }
);

// Index for faster queries - include role for separate buyer/seller conversations
AIChatMessageSchema.index({ user: 1, role: 1, createdAt: -1 });

export default mongoose.model<IAIChatMessage>('AIChatMessage', AIChatMessageSchema);

