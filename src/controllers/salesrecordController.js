const mongoose = require("mongoose");

const Customer = require("../models/customer");
const Car = require("../models/car");
const Salesrecord = require("../models/salesrecord");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");



exports.salesrecord_list = asyncHandler(async (req, res, next) => {
    const allSalesrecord = await Salesrecord.find().sort({ purchasedate: -1 }).exec();
    res.json(allSalesrecord);
});

exports.salesrecord_detail = asyncHandler(async (req, res, next) => {
    const salesrecord = await Salesrecord.findById(req.params.id)
        .populate('car')
        .populate('buyer')
        .exec();

    if (salesrecord === null) {
        return res.status(404).json({ error: "Sales record not found" });
    }

    res.json(salesrecord);
});

exports.salesrecord_create = [
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

    asyncHandler(async (req, res, next) => {
        // 检查用户是否为管理员
        if (!req.user.is_admin) {
            return res.status(403).json({ error: "Access denied. Only administrators can create sales records." });
        }
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        const salesrecord = new Salesrecord({
            car: req.body.car,
            buyer: req.body.buyer,
            salesman: req.body.salesman,
            purchasedate: req.body.purchasedate || new Date(),
            transactionprice: req.body.transactionprice,
        });

        await salesrecord.save();
        res.status(201).json(salesrecord);
    }),
];

exports.salesrecord_update = [
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

    asyncHandler(async (req, res, next) => {
        // 检查用户是否为管理员
        if (!req.user.is_admin) {
            return res.status(403).json({ error: "Access denied. Only administrators can update sales records." });
        }

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        const salesrecordExists = await Salesrecord.exists({ _id: req.params.id });
        if (!salesrecordExists) {
            return res.status(404).json({ error: 'Sales record not found' });
        }

        const updatedSalesrecord = await Salesrecord.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    car: req.body.car,
                    buyer: req.body.buyer,
                    salesman: req.body.salesman,
                    purchasedate: req.body.purchasedate,
                    transactionprice: req.body.transactionprice,
                },
            },
            { new: true, runValidators: true }
        );

        res.json(updatedSalesrecord);
    }),
];

exports.salesrecord_delete = asyncHandler(async (req, res, next) => {
    // check if the user is admin
    if (!req.user.is_admin) {
        return res.status(403).json({ error: "Access denied. Only administrators can delete sales records." });
    }

    const salesrecord = await Salesrecord.findById(req.params.id).exec();

    if (salesrecord == null) {
        return res.status(404).json({ error: 'Sales record not found' });
    }

    await Salesrecord.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Sales record deleted successfully' });
});


