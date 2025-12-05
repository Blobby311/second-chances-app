import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  chat: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

export interface IChat extends Document {
  buyer: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  lastMessage?: mongoose.Types.ObjectId;
  lastMessageAt?: Date;
  unreadCount: {
    buyer: number;
    seller: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const ChatSchema = new Schema<IChat>(
  {
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    lastMessageAt: { type: Date },
    unreadCount: {
      buyer: { type: Number, default: 0 },
      seller: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

ChatSchema.index({ buyer: 1, seller: 1 }, { unique: true });
ChatSchema.index({ lastMessageAt: -1 });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
export default mongoose.model<IChat>('Chat', ChatSchema);

