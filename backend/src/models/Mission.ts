import mongoose, { Document, Schema } from 'mongoose';

export interface IMission extends Document {
  name: string;
  description: string;
  type: 'daily' | 'weekly';
  points: number;
  criteria: {
    type: string; // 'place-order', 'leave-review', 'browse-products', etc.
    value: number;
  };
  isActive: boolean;
}

export interface IUserMission extends Document {
  user: mongoose.Types.ObjectId;
  mission: mongoose.Types.ObjectId;
  progress: number;
  isCompleted: boolean;
  isClaimed: boolean;
  completedAt?: Date;
  resetAt: Date; // For daily/weekly resets
  createdAt: Date;
  updatedAt: Date;
}

const MissionSchema = new Schema<IMission>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['daily', 'weekly'], required: true },
    points: { type: Number, required: true, min: 0 },
    criteria: {
      type: { type: String, required: true },
      value: { type: Number, required: true },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const UserMissionSchema = new Schema<IUserMission>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mission: { type: Schema.Types.ObjectId, ref: 'Mission', required: true },
    progress: { type: Number, default: 0, min: 0 },
    isCompleted: { type: Boolean, default: false },
    isClaimed: { type: Boolean, default: false },
    completedAt: { type: Date },
    resetAt: { type: Date, required: true },
  },
  { timestamps: true }
);

UserMissionSchema.index({ user: 1, mission: 1, resetAt: 1 });
UserMissionSchema.index({ resetAt: 1 });

export const Mission = mongoose.model<IMission>('Mission', MissionSchema);
export default mongoose.model<IUserMission>('UserMission', UserMissionSchema);

