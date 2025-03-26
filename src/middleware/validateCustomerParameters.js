const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Car = require('../models/car');

const validateCustomerParameters = [
    body("firstname")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("firstname must be specified."),
    body("lastname")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("lastname name must be specified."),
    body("cars")
        .optional()
        .isArray().withMessage("Cars must be an array of IDs")
        .custom(async (cars) => {
            try {
                console.log("Validating cars:", cars);

                if (cars.length === 0) {
                    return true;
                }

                for (let id of cars) {
                    console.log("Checking car ID:", id);

                    if (!mongoose.Types.ObjectId.isValid(id)) {
                        console.log("Invalid car ID format:", id);
                        throw new Error(`Invalid car ID format: ${id}`);
                    }
                }

                const existingCars = await Car.find({
                    _id: { $in: cars }
                }).select('_id');

                console.log("Found cars:", existingCars);

                const foundIds = existingCars.map(car => car._id.toString());
                const notFoundIds = cars.filter(id => !foundIds.includes(id));

                if (notFoundIds.length > 0) {
                    console.log("Cars not found:", notFoundIds);
                    throw new Error(`Car(s) not found: ${notFoundIds.join(", ")}`);
                }

                return true;
            } catch (error) {
                console.error("Car validation error:", error);
                throw error;
            }
        }),
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

module.exports = validateCustomerParameters; 