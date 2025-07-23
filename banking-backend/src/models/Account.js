
// src/models/Account.js
// Mongoose model for bank accounts. Defines schema, pre-save hooks for hashing PIN, and methods.

import mongoose from 'mongoose'; // Import Mongoose
import bcrypt from 'bcryptjs'; // Import bcryptjs for password/PIN hashing

// Define the schema for the Account model
const accountSchema = new mongoose.Schema({
    accountNumber: {
        type: String,
        required: [true, 'Account number is required'], // Must be provided
        unique: true, // Each account number must be unique
        trim: true, // Remove leading/trailing whitespace
        match: [/^\d{10,16}$/, 'Account number must be 10-16 digits'] // Regex for validation
    },
    debitPin: {
        type: String,
        required: [true, 'Debit PIN is required'] // Must be provided
    },
    accountHolderName: {
        type: String,
        required: [true, 'Account holder name is required'], // Must be provided
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'] // Max length validation
    },
    balance: {
        type: Number,
        default: 0, // Default balance is 0
        min: [0, 'Balance cannot be negative'] // Balance cannot go below 0
    },
    isActive: {
        type: Boolean,
        default: true // Account is active by default
    },
    accountType: {
        type: String,
        enum: ['savings', 'current', 'salary'], // Allowed account types
        default: 'savings' // Default account type
    },
    // Array of ObjectIds referencing Transaction documents associated with this account.
    // This allows for populating transactions if needed, but transactions are also stored separately.
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction' // Refers to the 'Transaction' model
    }],
    createdAt: {
        type: Date,
        default: Date.now // Automatically set creation timestamp
    }
}, {
    timestamps: true // Mongoose adds 'createdAt' and 'updatedAt' fields automatically
});

// Pre-save hook: Hash the debit PIN before saving the account document.
// This ensures that PINs are never stored in plain text in the database.
accountSchema.pre('save', async function(next) {
    // Only hash the PIN if it has been modified (or is new).
    // This prevents re-hashing an already hashed PIN on subsequent saves.
    if (!this.isModified('debitPin')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12); // Generate a salt (random string) with 12 rounds of hashing.
        this.debitPin = await bcrypt.hash(this.debitPin, salt); // Hash the PIN using the generated salt.
        next(); // Proceed to save the document.
    } catch (error) {
        next(error); // Pass any hashing errors to the next middleware (error handler).
    }
});

// Instance method: Compare a candidate PIN (provided by user) with the hashed PIN stored in the database.
accountSchema.methods.comparePin = async function(candidatePin) {
    return await bcrypt.compare(candidatePin, this.debitPin); // Returns true if they match, false otherwise.
};

// Override toJSON method: This method is called when a Mongoose document is converted to a JSON object (e.g., for API responses).
// We use it to remove sensitive data like 'debitPin' from the output.
accountSchema.methods.toJSON = function() {
    const account = this.toObject(); // Get a plain JavaScript object representation of the Mongoose document.
    delete account.debitPin; // Remove the 'debitPin' field from the object.
    return account; // Return the modified object.
};

export default mongoose.model('Account', accountSchema); // Export the Account model