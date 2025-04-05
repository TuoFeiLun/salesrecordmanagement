const mongoose = require("mongoose");

const Customer = require("../models/customer");
const Car = require("../models/car");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const validateCustomerParameters = require("../middleware/validateCustomerParameters");


exports.customer_list = asyncHandler(async (req, res, next) => {
    // 构建查询条件
    const queryConditions = {};

    // 如果用户不是管理员，只显示由他们自己创建的客户
    if (!req.user.is_admin) {
        queryConditions.createdBy = req.user.user_id;
    }

    // 创建一个查询的克隆用于计算总文档数
    const countQuery = Customer.find(queryConditions);

    // 执行主查询并添加分页
    const customers = await Customer
        .find(queryConditions)
        .populate({
            path: 'cars',
            select: 'brandname cartype price productionarea'
        })
        .populate({
            path: 'createdBy',
            select: 'username'
        })
        .sort({ firstname: 1 })
        .skip((req.paginate.page - 1) * req.paginate.limit)
        .limit(req.paginate.limit)
        .exec();

    // 计算总文档数用于分页
    const totalCustomers = await countQuery.countDocuments();
    const totalPages = Math.ceil(totalCustomers / req.paginate.limit);

    // 转换 Mongoose 文档为普通对象
    const plainData = JSON.parse(JSON.stringify(customers));

    // 直接返回数据和分页信息，无需生成分页链接
    res.status(200).json({
        data: plainData,
        pagination: {
            total: totalCustomers,
            page: req.paginate.page,
            totalPages: totalPages,
            limit: req.paginate.limit
        }
    });
});

exports.customer_detail = asyncHandler(async (req, res, next) => {
    const customer = await Customer.findById(req.params.id).exec();

    if (customer === null) {
        return res.status(404).json({ error: "Customer not found" });
    }

    // check if the user is admin or the creator of the customer
    if (!req.user.is_admin && customer.createdBy.toString() !== req.user.user_id) {
        return res.status(403).json({ error: "Access denied" });
    }

    res.json({ customer });
});

exports.customer_create = [
    validateCustomerParameters,
    asyncHandler(async (req, res, next) => {
        const customer = new Customer({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            cars: req.body.cars || [],// receive the array of car IDs
            createdBy: req.user.user_id
        });

        // save the customer information to the database
        await customer.save();

        // return the success response, and populate the cars information
        const populatedCustomer = await Customer.findById(customer._id)
            .populate('cars') // populate the cars information, only select the specific fields
            .exec();

        res.status(201).json({
            message: "Customer created successfully",
            customer: populatedCustomer
        });

    })];


exports.customer_update = [
    validateCustomerParameters,
    asyncHandler(async (req, res, next) => {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // check if the user is admin or the creator of the customer
        if (!req.user.is_admin && customer.createdBy.toString() !== req.user.user_id) {
            return res.status(403).json({ error: "Access denied, you are not the creator of this customer or you are not an admin" });
        }

        // if (!errors.isEmpty()) {
        //     return res.status(400).json({
        //         errors: errors.array(),
        //     });
        // }

        const updatedCustomer = await Customer.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    cars: req.body.cars,
                }
            },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedCustomer);
    })
];

exports.customer_delete = asyncHandler(async (req, res, next) => {
    const customer = await Customer.findById(req.params.id).exec();

    if (customer == null) {
        return res.status(404).json({ error: 'Customer not found' });
    }

    // check if the user is admin or the creator of the customer
    if (!req.user.is_admin && customer.createdBy.toString() !== req.user.user_id) {
        return res.status(403).json({ error: "Access denied, you are not the creator of this customer or you are not an admin" });
    }

    await Customer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Customer deleted successfully' });

    next();


})