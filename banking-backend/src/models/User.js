

import mongoose from 'mongoose'; // Import Mongoose
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing

// Define the schema for the User model
const userSchema = new mongoose.Schema({
    accountNumber: {
        type: String,
        required: [true, 'Account number is required'], // Must be provided
        unique: true, // Ensures each user is linked to a unique account number
        ref: 'Account' // Reference to the 'Account' model (for potential population or linking)
    },
    email: {
        type: String,
        required: [true, 'Email is required'], // Must be provided
        unique: true, // Ensures each email is unique
        lowercase: true, // Store emails in lowercase
        trim: true, // Remove leading/trailing whitespace
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, // Regex for email format validation
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'], // Must be provided
        minlength: [6, 'Password must be at least 6 characters'], // Minimum length validation
        select: false // Do not return the password field by default in queries (security)
    },
    isVerified: {
        type: Boolean,
        default: true // Assuming email verification is not in scope for this project, default to true
    },
    lastLogin: {
        type: Date // Timestamp of the last successful login
    },
    loginAttempts: {
        type: Number,
        default: 0 // Counter for failed login attempts
    },
    lockUntil: Date, // Timestamp until which the account is locked (due to failed attempts)
    isLocked: {
        type: Boolean,
        default: false // Flag to indicate if the account is currently locked
    }
}, {
    timestamps: true // Mongoose adds 'createdAt' and 'updatedAt' fields automatically
});

// Virtual property: 'isAccountLocked'
// This is a non-persisted property that dynamically checks if the account is currently locked.
userSchema.virtual('isAccountLocked').get(function() {
    // An account is locked if 'lockUntil' exists and its value is in the future.
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save hook: Hash the password before saving the user document.
// This ensures that passwords are never stored in plain text in the database.
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new).
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12); // Generate a salt (random string) with 12 rounds of hashing.
        this.password = await bcrypt.hash(this.password, salt); // Hash the password using the generated salt.
        next(); // Proceed to save the document.
    } catch (error) {
        next(error); // Pass any hashing errors to the next middleware (error handler).
    }
});

// Instance method: 'comparePassword'
// Compares a candidate password (provided by user during login) with the hashed password stored in the database.
// Also handles login attempt tracking and account locking logic.
userSchema.methods.comparePassword = async function(candidatePassword) {
    // If the account is already locked, throw an error immediately.
    if (this.isAccountLocked) {
        // This error will be caught in the controller and handled there to return a 403 response.
        throw new Error('Account is temporarily locked'); 
    }
    
    // Compare the provided password with the stored hashed password.
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    
    if (!isMatch) {
        this.loginAttempts += 1; // Increment the count of failed login attempts.
        
        // If 5 or more failed attempts, lock the account for 15 minutes.
        if (this.loginAttempts >= 5) {
            this.isLocked = true;
            this.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes (in milliseconds).
        }
        
        await this.save(); // Save the updated login attempts and/or lock status to the database.
        return false; // Passwords do not match.
    }
    
    // If passwords match AND there were previous failed attempts or the account was locked, reset the status.
    if (this.loginAttempts > 0 || this.isLocked) {
        this.loginAttempts = 0; // Reset login attempts to zero.
        this.isLocked = false; // Unlock the account.
        this.lockUntil = undefined; // Clear the lock timestamp.
        await this.save(); // Save the reset status to the database.
    }
    
    return true; // Passwords match, login is successful.
};


userSchema.methods.toJSON = function() {
    const user = this.toObject(); // Get a plain JavaScript object representation of the Mongoose document.
    delete user.password; // Remove the 'password' field.
    delete user.loginAttempts; // Remove 'loginAttempts'.
    delete user.lockUntil; // Remove 'lockUntil'.
    delete user.isLocked; // Remove 'isLocked'.
    return user; // Return the modified object.
};

export default mongoose.model('User', userSchema); // Export the User model
