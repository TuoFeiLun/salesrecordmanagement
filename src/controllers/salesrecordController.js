const mongoose = require("mongoose");

const Customer = require("../models/customer");
const Car = require("../models/car");
const Salesrecord = require("../models/salesrecord");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const validateSalesRecordParameters = require("../middleware/validateSalesRecordParameters");
const queryBuilder = require("../middleware/queryBuilder");




exports.salesrecord_list = [
    queryBuilder,
    asyncHandler(async (req, res, next) => {
        try {
            let query = Salesrecord.find();

            // 处理汽车品牌查询
            if (req.queryConditions['car.brandname']) {
                const cars = await Car.find({
                    brandname: req.queryConditions['car.brandname']
                });
                if (!cars.length) {
                    return res.status(200).json({
                        message: "No cars found with the specified brand",
                        data: [],
                        pagination: {
                            total: 0,
                            page: req.pagination.page,
                            totalPages: 0,
                            limit: req.pagination.limit
                        }
                    });
                }
                const carIds = cars.map(car => car._id);
                query = query.where('car').in(carIds);
            }

            // 处理买家名字查询
            if (req.queryConditions['buyer.firstname']) {
                const buyers = await Customer.find({
                    firstname: req.queryConditions['buyer.firstname']
                });
                if (!buyers.length) {
                    return res.status(200).json({
                        message: "No buyers found with the specified name",
                        data: [],
                        pagination: {
                            total: 0,
                            page: req.pagination.page,
                            totalPages: 0,
                            limit: req.pagination.limit
                        }
                    });
                }
                const buyerIds = buyers.map(buyer => buyer._id);
                query = query.where('buyer').in(buyerIds);
            }

            // 处理销售员查询
            if (req.queryConditions.salesman) {
                query = query.where('salesman').regex(req.queryConditions.salesman.$regex);
            }

            // 处理日期范围查询
            if (req.queryConditions.purchasedate) {
                if (req.queryConditions.purchasedate.$gte) {
                    query = query.where('purchasedate').gte(req.queryConditions.purchasedate.$gte);
                }
                if (req.queryConditions.purchasedate.$lte) {
                    query = query.where('purchasedate').lte(req.queryConditions.purchasedate.$lte);
                }
            }

            // 处理价格范围查询
            if (req.queryConditions.transactionprice) {
                if (req.queryConditions.transactionprice.$gte) {
                    query = query.where('transactionprice').gte(req.queryConditions.transactionprice.$gte);
                }
                if (req.queryConditions.transactionprice.$lte) {
                    query = query.where('transactionprice').lte(req.queryConditions.transactionprice.$lte);
                }
            }

            // 创建一个新的查询对象用于计数
            const countQuery = query.clone();

            // 执行查询
            const [salesRecords, total] = await Promise.all([
                query
                    .populate({
                        path: 'car',
                        select: 'brandname cartype price'
                    })
                    .populate({
                        path: 'buyer',
                        select: 'firstname lastname'
                    })
                    .sort(req.sortOptions || { purchasedate: -1 })
                    .skip(req.pagination.skip)
                    .limit(req.pagination.limit)
                    .exec(),
                countQuery.countDocuments()
            ]);

            // Handle no results
            if (!salesRecords.length) {
                let message = "No sales records found matching the criteria";
                if (req.queryConditions['car.brandname']) {
                    message = `No sales records found for cars with brand "${req.queryConditions['car.brandname'].$regex}"`;
                } else if (req.queryConditions['buyer.firstname']) {
                    message = `No sales records found for buyers with name "${req.queryConditions['buyer.firstname'].$regex}"`;
                } else if (req.queryConditions.salesman) {
                    message = `No sales records found for salesman "${req.queryConditions.salesman.$regex}"`;
                } else if (req.queryConditions.purchasedate) {
                    message = "No sales records found in the specified date range";
                } else if (req.queryConditions.transactionprice) {
                    message = "No sales records found in the specified price range";
                }

                return res.status(200).json({
                    message,
                    data: [],
                    pagination: {
                        total,
                        page: req.pagination.page,
                        totalPages: Math.ceil(total / req.pagination.limit),
                        limit: req.pagination.limit
                    }
                });
            }

            res.json({
                data: salesRecords,
                pagination: {
                    total,
                    page: req.pagination.page,
                    totalPages: Math.ceil(total / req.pagination.limit),
                    limit: req.pagination.limit
                }
            });
        } catch (error) {
            console.error('Query error:', error);
            next(error);
        }
    })
];


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


