


import express from 'express'; 
import { signup, login, verifyToken } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js'; 

const router = express.Router(); 


router.post('/signup', signup); // Route for user registration (POST request to /api/auth/signup)
router.post('/login', login);   // Route for user login (POST request to /api/auth/login)


router.get('/verify', authenticateToken, verifyToken); // Route to verify token and get user data (GET request to /api/auth/verify)

export default router; 