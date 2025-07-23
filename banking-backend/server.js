
import app from './src/app.js'; // Import the Express application
import connectDB from './src/config/database.js'; // Import the database connection function
import dotenv from 'dotenv'; // Used to load environment variables from a .env file

// Load environment variables from .env file (e.g., PORT, MONGODB_URI, JWT_SECRET)
dotenv.config();

// Connect to MongoDB database
connectDB();

// Define the port for the server, defaulting to 5000 if not specified in environment variables
const PORT = process.env.PORT || 5000;

// Start the Express server and listen on the specified port
const server = app.listen(PORT, () => {
    console.log(`
🚀 Banking API Server is running!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📊 Health Check: http://localhost:${PORT}/api/health
    `);
});

// Global error handling for unhandled promise rejections.
// This catches errors in asynchronous code that are not explicitly caught by .catch() blocks.
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err.message, err.stack);
    // Close the server gracefully before exiting the process
    server.close(() => {
        process.exit(1); // Exit with a failure code (1)
    });
});

// Global error handling for uncaught exceptions.
// This catches synchronous errors that are not handled by try/catch blocks.
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message, err.stack);
    // Exit the process immediately as the application state might be corrupted
    process.exit(1); // Exit with a failure code (1)
});