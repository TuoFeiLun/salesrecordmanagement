const mongoose = require("mongoose");

const Customer = require("../models/customer");
const Car = require("../models/car");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { generatePaginationLinks } = require("../utils/generatePaginationLinks");


exports.customer_list = asyncHandler(async (req, res, next) => {
    // build the query conditions
    const queryConditions = {};

    // if the user is not admin, only view the customers created by themselves
    if (!req.user.is_admin) {
        queryConditions.createdBy = req.user.user_id;
    }

    const allCustomer = await Customer
        .find(queryConditions)
        .sort({ firstname: 1 })
        .paginate({ ...req.paginate });

    res.status(200)
        .links(generatePaginationLinks(
            req.originalUrl,
            req.paginate.page,
            allCustomer.totalPages,
            req.paginate.limit
        )).json(allCustomer.docs);
    next();
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
            // check if each ID is a valid MongoDB ObjectId format
            for (let id of cars) {
                if (!mongoose.Types.ObjectId.isValid(id)) {
                    throw new Error("Invalid car ID format");
                }

                // optional: check if each ID exists in the database
                const car = await Car.findById(id);
                if (!car) {
                    throw new Error(`Car with ID ${id} not found`);
                }
            }
            return true;
        }),

    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req);
        // create a new customer instance
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
                console.log("Validating cars:", cars); // add the debug log

                // if the cars is an empty array, return true
                if (cars.length === 0) {
                    return true;
                }

                // 检查每个ID是否是有效的MongoDB ObjectId格式
                for (let id of cars) {
                    console.log("Checking car ID:", id); // 添加调试日志

                    if (!mongoose.Types.ObjectId.isValid(id)) {
                        console.log("Invalid car ID format:", id); // 添加调试日志
                        throw new Error(`Invalid car ID format: ${id}`);
                    }
                }

                // 检查每个ID是否存在于数据库中
                const existingCars = await Car.find({
                    _id: { $in: cars }
                }).select('_id');

                console.log("Found cars:", existingCars); // 添加调试日志

                // 转换为ID字符串数组，方便比较
                const foundIds = existingCars.map(car => car._id.toString());

                // 找出未找到的车辆ID
                const notFoundIds = cars.filter(id => !foundIds.includes(id));

                if (notFoundIds.length > 0) {
                    console.log("Cars not found:", notFoundIds); // 添加调试日志
                    throw new Error(`Car(s) not found: ${notFoundIds.join(", ")}`);
                }

                return true; // 所有验证通过
            } catch (error) {
                console.error("Car validation error:", error); // 添加错误日志
                throw error; // 重新抛出错误
            }
        }),

    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req);

        // 检查客户是否存在
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // check if the user is admin or the creator of the customer
        if (!req.user.is_admin && customer.createdBy.toString() !== req.user.user_id) {
            return res.status(403).json({ error: "Access denied, you are not the creator of this customer or you are not an admin" });
        }

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

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
    })];


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