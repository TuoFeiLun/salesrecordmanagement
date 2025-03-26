const mongoose = require("mongoose");

const Customer = require("../models/customer");
const Car = require("../models/car");
const Salesrecord = require("../models/salesrecord");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const validateSalesRecordParameters = require("../middleware/validateSalesRecordParameters");



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
    validateSalesRecordParameters,
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
    validateSalesRecordParameters,
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


