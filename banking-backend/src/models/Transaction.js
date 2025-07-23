
// src/models/Transaction.js
// Mongoose model for financial transactions. Defines schema, pre-save hooks, and indexes.

import mongoose from 'mongoose'; // Import Mongoose

// Define the schema for the Transaction model
const transactionSchema = new mongoose.Schema({
    accountNumber: {
        type: String,
        required: [true, 'Account number is required'], // Must be provided
        // This could also be type: mongoose.Schema.Types.ObjectId, ref: 'Account'
        // if you primarily want to link to the Account document via its _id.
        // Using String here allows for direct lookup based on accountNumber string.
    },
    type: {
        type: String,
        enum: ['credit', 'debit', 'transfer'], // Allowed transaction types
        required: [true, 'Transaction type is required'] // Must be provided
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'], // Must be provided
        validate: {
            validator: function(v) {
                return v !== 0; // Ensure the transaction amount is not zero
            },
            message: 'Amount cannot be zero'
        }
    },
    description: {
        type: String,
        default: 'Transaction', // Default description if none is provided
        maxlength: [200, 'Description cannot exceed 200 characters'] // Max length validation
    },
    balanceAfter: {
        type: Number,
        required: [true, 'Balance after transaction is required'] // Store the account balance after this transaction occurred
    },
    reference: {
        type: String,
        unique: true, // Ensures each transaction reference is unique
        sparse: true // Allows multiple documents to have a null or missing 'reference' field without violating unique constraint
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'], // Transaction status
        default: 'completed' // Default status is 'completed'
    }
}, {
    timestamps: true // Mongoose adds 'createdAt' and 'updatedAt' fields automatically
});

// Pre-save hook: Generate a unique reference string before saving if one is not already provided.
transactionSchema.pre('save', function(next) {
    if (!this.reference) {
        // Generate a unique reference string using current timestamp and random alphanumeric characters.
        this.reference = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    next(); // Proceed to save the document.
});

// Create an index on 'accountNumber' and 'createdAt' for efficient querying.
// This is crucial for quickly fetching transactions for a specific account, sorted by date.
transactionSchema.index({ accountNumber: 1, createdAt: -1 });

export default mongoose.model('Transaction', transactionSchema); // Export the Transaction model