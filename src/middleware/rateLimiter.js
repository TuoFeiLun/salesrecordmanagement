const rateLimit = require('express-rate-limit');

// Default rate limit configuration
const defaultConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
};

// Create different rate limiters for different endpoints
const createRateLimiter = (config = {}) => {
    return rateLimit({
        ...defaultConfig,
        ...config
    });
};

// Specific rate limiters for different endpoints
const authLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 attempts per hour for auth endpoints
    message: {
        error: 'Too many login attempts, please try again after an hour.'
    }
});

const apiLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 150, // 150 requests per 15 minutes
    message: {
        error: 'Too many API requests, please try again later.'
    }
});

const createLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 60, // 60 create requests per hour
    message: {
        error: 'Too many create requests, please try again later.'
    }
});

module.exports = {
    authLimiter,
    apiLimiter,
    createLimiter,
    createRateLimiter // Export the factory function for custom configurations
}; 