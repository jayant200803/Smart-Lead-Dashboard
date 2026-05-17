import mongoose from 'mongoose';
import { logger } from '../utils/logger';

// Cache the connection across serverless function invocations
let isConnected = false;

export const connectDB = async (): Promise<void> => {
  // Reuse existing connection if already established
  if (isConnected) return;

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    logger.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    isConnected = conn.connection.readyState === 1;
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  logger.info('MongoDB reconnected');
});
