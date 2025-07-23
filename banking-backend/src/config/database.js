
// src/config/database.js
// This file handles the connection to your MongoDB database using Mongoose.

import mongoose from 'mongoose'; // Import Mongoose
import dotenv from 'dotenv'; // Used to load environment variables

dotenv.config(); // Load environment variables from .env file

// Function to establish and manage MongoDB connection
const connectDB = async () => {
    try {
        // Set mongoose option to suppress deprecation warning for findOneAndUpdate, etc.
        mongoose.set('strictQuery', false);
        
        // Attempt to connect to MongoDB using the URI from environment variables
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true, // Use the new URL parser
            useUnifiedTopology: true, // Use the new server discovery and monitoring engine
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        
        // Listen for MongoDB connection error events
        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });

        // Listen for MongoDB disconnection events
        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB disconnected');
        });

        // Graceful shutdown: Close MongoDB connection when the application terminates (e.g., Ctrl+C)
        process.on('SIGINT', async () => {
            await mongoose.connection.close(); // Close the Mongoose connection
            console.log('MongoDB connection closed due to app termination.');
            process.exit(0); // Exit the process successfully
        });

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1); // Exit with a failure code if connection fails
    }
};

export default connectDB; // Export the connection function

