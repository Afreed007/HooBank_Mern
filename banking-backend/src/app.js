
// src/app.js
// This file sets up the core Express application, middleware, and routes.

import express from 'express'; // Import the Express framework
import cors from 'cors'; // Middleware for enabling Cross-Origin Resource Sharing
import dotenv from 'dotenv'; // Used to load environment variables
import authRoutes from './routes/auth.js'; // Import authentication routes
import { errorHandler, notFound } from './middleware/errorHandler.js'; // Import custom error handling middleware

// Load environment variables from .env file
dotenv.config();

const app = express(); // Initialize the Express application

// CORS Configuration: Allows your frontend (e.g., running on localhost:3000) to make requests to this backend.
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Allowed origin for frontend requests
    credentials: true, // Allow sending of HTTP cookies (if used for sessions/auth)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed request headers
};

// Middleware:
app.use(cors(corsOptions)); // Enable CORS with the defined options
app.use(express.json({ limit: '10mb' })); // Parse incoming JSON payloads with a size limit
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads

// Security Headers: Add various security headers to protect against common web vulnerabilities.
app.use((req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff'); // Prevents browsers from MIME-sniffing a response away from the declared content-type
    res.header('X-Frame-Options', 'DENY'); // Prevents clickjacking by disallowing embedding in iframes
    res.header('X-XSS-Protection', '1; mode=block'); // Enables XSS filter in modern browsers
    next(); // Pass control to the next middleware
});

// Routes: Mount the authentication routes under the '/api/auth' path.
app.use('/api/auth', authRoutes);

// Health Check Endpoint: A simple endpoint to check if the API is running.
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Banking API is running',
        timestamp: new Date().toISOString(), // Current timestamp
        uptime: process.uptime() // Server uptime in seconds
    });
});

// 404 Not Found Handler: This middleware catches requests that don't match any defined routes.
// It must be placed *before* the global error handler.
app.use(notFound);

// Global Error Handler: This middleware catches all errors passed from other middleware or route handlers.
// It must be placed *last* in your middleware chain.
app.use(errorHandler);

export default app; // Export the configured Express app
