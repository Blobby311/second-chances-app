import mongoose from 'mongoose';
import { getMongoConnectionString } from './azure';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = getMongoConnectionString();
    
    // MongoDB connection options
    const options = {
      retryWrites: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000, // Increased to 30 seconds
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000, // Connection timeout
    };
    
    await mongoose.connect(mongoURI, options);
    console.log('MongoDB connected successfully');
    console.log('Database:', mongoose.connection.name);
  } catch (error: any) {
    console.error('MongoDB connection error:', error);
    console.error('\n⚠️  Troubleshooting steps:');
    console.error('1. Check if your MongoDB Atlas cluster is running (not paused)');
    console.error('2. Verify your IP address is whitelisted in MongoDB Atlas');
    console.error('3. Check your MONGODB_URI environment variable is correct');
    console.error('4. For free tier: Cluster may auto-pause - wake it up in Atlas dashboard\n');
    // Don't exit in development - let it retry
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

