import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/promptifyr';
    
    const options = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    const conn = await mongoose.connect(mongoURI, options);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    }
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('📴 MongoDB disconnected');
      }
    });
    
    mongoose.connection.on('reconnected', () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('🔄 MongoDB reconnected');
      }
    });
    
    // Handle app termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        if (process.env.NODE_ENV !== 'production') {
          console.log('🛑 MongoDB connection closed due to app termination');
        }
        process.exit(0);
      } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        process.exit(1);
      }
    });
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}; 