
// src/middleware/authMiddleware.js
// This middleware is responsible for authenticating requests using JWT tokens.

import jwt from 'jsonwebtoken'; // Import jsonwebtoken for token verification
import User from '../models/User.js'; // Import the User Mongoose model
import dotenv from 'dotenv'; // Used to load environment variables

dotenv.config(); // Load environment variables

// Middleware to authenticate JWT token from the request header
export const authenticateToken = async (req, res, next) => {
    let token;

    // 1. Check if the Authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token string by removing the 'Bearer ' prefix
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify the token using the JWT_SECRET from environment variables
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Find the user in the database based on the userId from the decoded token payload.
            // .select('-password') ensures the password field is not returned for security.
            const user = await User.findById(decoded.userId).select('-password');

            if (!user) {
                // If no user is found for the ID in the token, it's an unauthorized request
                return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
            }

            // 4. Attach the found user object to the request for use in subsequent middleware/route handlers.
            req.user = user;
            next(); // Pass control to the next middleware or route handler

        } catch (error) {
            // 5. Handle specific JWT errors for more informative responses.
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ success: false, message: 'Not authorized, token expired' });
            }
            // Catch any other unexpected errors during token verification or user lookup
            console.error('Authentication error:', error.message);
            return res.status(500).json({ success: false, message: 'Server error during authentication' });
        }
    }

    // 6. If no token was found in the Authorization header, return an unauthorized response.
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }
};
