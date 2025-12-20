import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  orderId: string; // Display ID like #XM12345
  buyer: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  status: 'pending' | 'ready-for-pickup' | 'on-the-way' | 'delivered' | 'completed' | 'cancelled';
  total: number;
  pointsUsed: number;
  rewardUsed?: mongoose.Types.ObjectId;
  paymentMethod: string;
  deliveryMethod: string;
  address?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, unique: true, required: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    status: {
      type: String,
      enum: ['pending', 'ready-for-pickup', 'on-the-way', 'delivered', 'completed', 'cancelled'],
      default: 'pending',
    },
    total: { type: Number, required: true, min: 0 },
    pointsUsed: { type: Number, default: 0, min: 0 },
    rewardUsed: { type: Schema.Types.ObjectId, ref: 'Reward' },
    paymentMethod: { type: String, required: true },
    deliveryMethod: { type: String, required: true },
    address: { type: Schema.Types.ObjectId, ref: 'Address' },
    notes: { type: String },
  },
  { timestamps: true }
);

// Generate order ID before saving
OrderSchema.pre('validate', async function (next) {
  if (!this.orderId) {
    const prefix = ['XM', 'YM', 'ZN'][Math.floor(Math.random() * 3)];
    const number = Math.floor(Math.random() * 90000) + 10000;
    this.orderId = `#${prefix}${number}`;
  }
  next();
});

OrderSchema.index({ buyer: 1, status: 1 });
OrderSchema.index({ seller: 1, status: 1 });
OrderSchema.index({ createdAt: -1 });

export default mongoose.model<IOrder>('Order', OrderSchema);

