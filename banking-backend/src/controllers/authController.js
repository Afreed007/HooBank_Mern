
// src/controllers/authController.js
// This file contains the logic for user authentication (signup, login, token verification).

import User from '../models/User.js'; // Import the User Mongoose model
import Account from '../models/Account.js'; // Import the Account Mongoose model
import Transaction from '../models/Transaction.js'; // Import the Transaction Mongoose model
import { generateToken } from '../utils/generateToken.js'; // Import the JWT token generation utility

// @desc      Register new user
// @route     POST /api/auth/signup
// @access    Public
export const signup = async (req, res, next) => {
    try {
        const { accountNumber, debitPin, email, password } = req.body;

        // 1. Validate input: Ensure all required fields are provided.
        if (!accountNumber || !debitPin || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // 2. Check if a user with the given email or account number already exists in the User collection.
        const existingUser = await User.findOne({ 
            $or: [{ email: email.toLowerCase() }, { accountNumber }] 
        });

        if (existingUser) {
            // Return specific message if email or account number is already registered.
            return res.status(400).json({
                success: false,
                message: existingUser.email === email.toLowerCase() 
                    ? 'Email already registered' 
                    : 'Account number already registered'
            });
        }

        // 3. Verify if the account exists and is active in the Account collection.
        const account = await Account.findOne({ accountNumber });

        if (!account) {
            return res.status(400).json({
                success: false,
                message: 'Invalid account number. Please contact your bank.'
            });
        }

        if (!account.isActive) {
            return res.status(400).json({
                success: false,
                message: 'Account is inactive. Please contact your bank.'
            });
        }

        // 4. Verify the provided debit PIN against the hashed PIN stored in the Account.
        const isPinValid = await account.comparePin(debitPin);
        if (!isPinValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid debit PIN for this account number'
            });
        }

        // 5. Create a new user in the User collection.
        // The password will be hashed by the pre-save hook defined in the User model.
        const user = await User.create({
            accountNumber,
            email: email.toLowerCase(),
            password 
        });

        // 6. Generate a JWT token for the newly registered user for immediate login.
        const token = generateToken(user._id, accountNumber);

        // 7. Fetch account details again to ensure the latest state (e.g., balance) for the response.
        // The toJSON method on the Account model will automatically remove the sensitive debitPin.
        const accountDetails = await Account.findOne({ accountNumber });

        // 8. Send a successful registration response.
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                accountNumber: user.accountNumber,
                email: user.email,
                accountDetails: accountDetails,
                transactions: [] // New user has no transactions initially
            }
        });

    } catch (error) {
        // Pass any caught errors to the global error handling middleware
        next(error); 
    }
};

// @desc      Login user
// @route     POST /api/auth/login
// @access    Public
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input: Ensure email and password are provided.
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // 2. Find the user by email and explicitly select the password field for comparison.
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            // If user not found, return an error and suggest signup to the frontend.
            return res.status(400).json({
                success: false,
                message: 'Email does not exist. Please sign up first.',
                redirectToSignup: true // Frontend can use this flag to switch to signup form
            });
        }

        // 3. Check if the user's account is locked due to too many failed attempts.
        if (user.isAccountLocked) {
            const timeRemaining = Math.ceil((user.lockUntil - Date.now()) / (1000 * 60));
            return res.status(403).json({
                success: false,
                message: `Account locked due to too many failed attempts. Try again in ${timeRemaining} minutes.`
            });
        }

        // 4. Compare the provided password with the hashed password stored in the database.
        // The User model's comparePassword method handles login attempts and account locking logic.
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid password'
            });
        }

        // 5. Update the last login timestamp for the user.
        user.lastLogin = new Date();
        await user.save(); // Save user to update lastLogin and reset login attempts/lock status

        // 6. Fetch associated account details and recent transactions for the dashboard.
        const account = await Account.findOne({ accountNumber: user.accountNumber });
        const transactions = await Transaction.find({ accountNumber: user.accountNumber })
            .sort({ createdAt: -1 }) // Sort by most recent transactions
            .limit(10); // Limit to the latest 10 transactions for initial load (can be adjusted)

        // 7. Generate a JWT token for the authenticated user.
        const token = generateToken(user._id, user.accountNumber);

        // 8. Send a successful login response with user data and token.
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                accountNumber: user.accountNumber,
                email: user.email,
                lastLogin: user.lastLogin,
                accountDetails: account, // Account model's toJSON method removes debitPin
                transactions: transactions
            }
        });

    } catch (error) {
        // Pass any caught errors to the global error handling middleware
        next(error); 
    }
};

// @desc      Verify token and get user data
// @route     GET /api/auth/verify
// @access    Private (requires authenticateToken middleware to be applied)
export const verifyToken = async (req, res, next) => {
    try {
        // The 'req.user' object is populated by the 'authenticateToken' middleware.
        // It contains the user document (without password) found from the token's userId.
        const user = req.user; 

        // Fetch fresh account details for the authenticated user.
        const account = await Account.findOne({ accountNumber: user.accountNumber });
        
        // Fetch ALL transactions for the authenticated user, sorted by most recent.
        // This is done to provide a complete history to the dashboard.
        const allTxns = await Transaction.find({ accountNumber: user.accountNumber })
            .sort({ createdAt: -1 });

        // Send a successful response with the latest user data.
        return res.json({
            success: true,
            user: {
                id: user._id,
                accountNumber: user.accountNumber,
                email: user.email,
                lastLogin: user.lastLogin,
                accountDetails: account, // Account model's toJSON method removes debitPin
                transactions: allTxns
            }
        });

    } catch (error) {
        // Pass any caught errors to the global error handling middleware
        next(error); 
    }
};