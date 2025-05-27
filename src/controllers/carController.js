const mongoose = require("mongoose");

const Car = require("../models/car");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const validateCarParameters = require("../middleware/validateCarParameters");



// Display list of all cars.

exports.car_list = asyncHandler(async (req, res, next) => {
    const allCars = await Car.find().sort({ brandname: 1 }).exec();
    res.json(allCars);
});

// Display detail page for a specific car
exports.car_detail = asyncHandler(async (req, res, next) => {
    const [car] = await Promise.all([
        Car.findById(req.params.id).exec(),

    ]);

    if (car === null) {
        // No results.
        const err = new Error("Car not found");
        err.status = 404;
        return next(err);
    }

    res.json({
        car: car,

    });
});

exports.car_create = [
    validateCarParameters,
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        // check if price is a valid number
        if (isNaN(Number(req.body.price))) {
            return res.status(400).json({
                error: "Price must be a valid number"
            });
        }

        try {
            const car = new Car({
                brandname: req.body.brandname,
                cartype: req.body.cartype,
                price: req.body.price,
                productionarea: req.body.productionarea,
                image: req.body.image,
            });

            // Add image if it exists
            if (req.file) {
                // convert image buffer to base64 string
                const base64Image = req.file.buffer.toString('base64');
                car.image = {
                    data: base64Image,
                    contentType: req.file.mimetype
                };
            }

            await car.save();
            res.status(201).json(car);
        } catch (error) {
            if (error.name === 'CastError' && error.path === 'price') {
                return res.status(400).json({
                    error: "Price must be a valid number"
                });
            }
            // catch other possible errors
            res.status(500).json({
                error: error.message
            });
        }
    }),
];


exports.car_delete = asyncHandler(async (req, res, next) => {
    // check if user is admin
    if (!req.user.is_admin) {
        return res.status(403).json({ error: "Access denied. Only administrators can delete cars." });
    }

    const car = await Car.findById(req.params.id).exec();

    if (car == null) {
        return res.status(204).json({ error: 'car not found' });
    }



    await Car.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Car deleted successfully' });

    next();
});

exports.car_update = [
    validateCarParameters,
    asyncHandler(async (req, res, next) => {
        if (!req.user.is_admin) {
            return res.status(403).json({ error: "Access denied. Only administrators can update cars." });
        }

        const errors = validationResult(req);

        // Check if the provided ID is a valid ObjectId
        const carExists = await Car.exists({ _id: req.params.id });
        if (!carExists) {
            return res.status(404).json({ error: 'Car not found' });
        }

        // check if price is a valid number
        if (isNaN(Number(req.body.price))) {
            return res.status(400).json({
                error: "Price must be a valid number"
            });
        }

        try {
            const car = new Car({
                brandname: req.body.brandname,
                cartype: req.body.cartype,
                price: req.body.price,
                productionarea: req.body.productionarea,
                image: req.body.image,
            });

            if (!errors.isEmpty()) {
                // There are errors. Render the form again with sanitized values and error messages.
                res.status(400).json({
                    car: car,
                    errors: errors.array(),
                });
                return;
            } else {
                // Data from form is valid. Update the record.
                const updateData = {
                    brandname: req.body.brandname,
                    cartype: req.body.cartype,
                    price: req.body.price,
                    productionarea: req.body.productionarea,
                    image: req.body.image,
                };

                // Add image if it exists
                if (req.file) {
                    // convert image buffer to base64 string
                    const base64Image = req.file.buffer.toString('base64');
                    updateData.image = {
                        data: base64Image,
                        contentType: req.file.mimetype
                    };
                }

                const updatedCar = await Car.findOneAndUpdate(
                    { _id: req.params.id },
                    { $set: updateData },
                    { new: true, runValidators: true } // `new: true` returns the updated document
                );

                res.status(200);
                res.json(updatedCar);
            }
        } catch (error) {
            if (error.name === 'CastError' && error.path === 'price') {
                return res.status(400).json({
                    error: "Price must be a valid number"
                });
            }
            // catch other possible errors
            res.status(500).json({
                error: error.message
            });
        }
    }),
];

