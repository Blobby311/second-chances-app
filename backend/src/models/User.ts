import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password: string;
  avatar?: string;
  roles: ('buyer' | 'seller')[];
  isVerified: boolean;
  referralCode: string;
  referredBy?: mongoose.Types.ObjectId;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  settings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    language: string;
    theme: string;
  };
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    password: { type: String, required: true },
    avatar: { type: String },
    roles: [{ type: String, enum: ['buyer', 'seller'], default: ['buyer'] }],
    isVerified: { type: Boolean, default: false },
    referralCode: { type: String, unique: true, sparse: true }, // Not required - generated in pre-save hook
    referredBy: { type: Schema.Types.ObjectId, ref: 'User' },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
      address: { type: String },
    },
    settings: {
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      language: { type: String, default: 'en' },
      theme: { type: String, default: 'light' },
    },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Generate referral code before saving
UserSchema.pre('save', async function (next) {
  if (!this.referralCode) {
    this.referralCode = `REF${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);

