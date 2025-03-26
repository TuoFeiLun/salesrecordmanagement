const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Car = require('../models/car');
const Customer = require('../models/customer');

const validateSalesRecordParameters = [
    body("car")
        .trim()
        .isLength({ min: 1 })
        .custom(async (value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('Invalid car ID format');
            }
            const carExists = await Car.findById(value);
            if (!carExists) {
                throw new Error('Car not found');
            }
            return true;
        }),

    body("buyer")
        .trim()
        .isLength({ min: 1 })
        .custom(async (value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('Invalid buyer ID format');
            }
            const buyerExists = await Customer.findById(value);
            if (!buyerExists) {
                throw new Error('Customer not found');
            }
            return true;
        }),

    body("salesman")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Salesman name is required"),

    body("purchasedate")
        .optional()
        .isISO8601()
        .toDate()
        .withMessage("Invalid date format"),

    body("transactionprice")
        .trim()
        .isNumeric()
        .withMessage("Transaction price must be a number"),

    // Add validation result handler as the last middleware
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }
        next();
    }
];

module.exports = validateSalesRecordParameters; 