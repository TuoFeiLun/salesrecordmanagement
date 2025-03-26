const mongoose = require("mongoose");

const Customer = require("../models/customer");
const Car = require("../models/car");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const { generatePaginationLinks } = require("../utils/generatePaginationLinks");
const validateCustomerParameters = require("../middleware/validateCustomerParameters");


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