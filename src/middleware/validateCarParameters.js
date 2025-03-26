const { body, validationResult } = require('express-validator');

const validateCarParameters = [
    body("brandname")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("brandname must be specified."),

    body("cartype")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("cartype name must be specified."),

    body("price")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("price must be specified."),

    body("productionarea")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("productionarea name must be specified."),

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

module.exports = validateCarParameters; 