

// src/middleware/errorHandler.js
// This global error handling middleware catches and formats errors for API responses.

export const errorHandler = (err, req, res, next) => {
    // Log the full error stack in development for debugging purposes.
    console.error('Error Stack:', err.stack);

    // Create a mutable copy of the error object to modify its properties.
    let error = { ...err };
    error.message = err.message; // Ensure the message property is always present.

    // Handle specific Mongoose errors:

    // CastError: Occurs when an invalid ObjectId is passed (e.g., a malformed ID in a URL parameter).
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = { message, statusCode: 404 };
    }

    // Duplicate key error (MongoDB error code 11000): Occurs when attempting to insert a document
    // with a unique field (like email or accountNumber) that already exists.
    if (err.code === 11000) {
        let message = 'Duplicate field value entered';
        // Customize the error message based on which unique field caused the conflict.
        if (err.keyPattern?.email) {
            message = 'Email already registered';
        } else if (err.keyPattern?.accountNumber) {
            message = 'Account number already registered';
        }
        error = { message, statusCode: 400 };
    }

    // Validation error: Occurs when data submitted does not conform to the Mongoose schema validation rules.
    if (err.name === 'ValidationError') {
        // Extract all validation error messages from the 'errors' object and join them.
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = { message, statusCode: 400 };
    }

    // Handle JWT (JSON Web Token) errors (though many are handled more specifically in authMiddleware).

    // JsonWebTokenError: Occurs if the token is malformed, invalid, or has a bad signature.
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = { message, statusCode: 401 };
    }

    // TokenExpiredError: Occurs if the provided JWT token has expired.
    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = { message, statusCode: 401 };
    }

    // Send the error response to the client.
    res.status(error.statusCode || 500).json({
        success: false, // Indicate that the request failed.
        message: error.message || 'Server Error', // Provide a custom or generic error message.
        // Include the stack trace only in development environment for security reasons.
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// 404 Not Found handler middleware: Catches requests to undefined routes.
export const notFound = (req, res, next) => {
    // Create a new Error object with a specific message for unfound routes.
    const error = new Error(`Route ${req.originalUrl} not found`);
    error.statusCode = 404; // Set the HTTP status code to 404.
    next(error); // Pass this custom error to the global error handler.
};