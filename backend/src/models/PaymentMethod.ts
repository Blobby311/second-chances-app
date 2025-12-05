import mongoose, { Document, Schema } from 'mongoose';

export interface IPaymentMethod extends Document {
  user: mongoose.Types.ObjectId;
  type: 'GrabPay' | 'TnG' | 'FPX' | 'Card';
  label: string;
  last4?: string; // For cards
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentMethodSchema = new Schema<IPaymentMethod>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['GrabPay', 'TnG', 'FPX', 'Card'],
      required: true,
    },
    label: { type: String, required: true },
    last4: { type: String },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PaymentMethodSchema.index({ user: 1 });

export default mongoose.model<IPaymentMethod>('PaymentMethod', PaymentMethodSchema);

