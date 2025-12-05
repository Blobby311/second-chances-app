import mongoose from 'mongoose';
import { getMongoConnectionString } from './azure';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = getMongoConnectionString();
    
    // Azure Cosmos DB connection options
    const options = {
      retryWrites: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    
    await mongoose.connect(mongoURI, options);
    console.log('MongoDB connected successfully');
    console.log('Database:', mongoose.connection.name);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

