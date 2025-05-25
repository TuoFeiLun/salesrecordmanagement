const express = require("express");
const router = express.Router();

const controller = require("../controllers/carController");
const carInfoSearchController = require("../controllers/carInfoSearchController");
const validateMongoId = require("../middleware/validateMongoId");
const authenticateWithJwt = require("../middleware/authenticateWithJwt");
const upload = require("../middleware/upload");


router.route("/")
    .get(authenticateWithJwt, controller.car_list) // GET list of all Authors
    .post(authenticateWithJwt, upload.single('image'), controller.car_create); // POST create a new Author with image

// all user can search car info
router.route("/info/search")
    .get(carInfoSearchController.car_info_search);

router.route("/:id")
    .all(validateMongoId('id'))
    .all(authenticateWithJwt)
    .get(controller.car_detail) // GET one Author
    .put(upload.single('image'), controller.car_update) // PUT update an Author with image
    .delete(controller.car_delete); // DELETE an Author

// Endpoint to fetch car image
router.route("/:id/image")
    .all(validateMongoId('id'))
    .get(async (req, res) => {
        try {
            const Car = require("../models/car");
            const car = await Car.findById(req.params.id).exec();

            if (!car || !car.image || !car.image.data) {
                return res.status(404).send('No image found');
            }

            // 返回带有base64数据的JSON对象
            res.json({
                contentType: car.image.contentType,
                data: car.image.data,
                base64String: `data:${car.image.contentType};base64,${car.image.data}`
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    });

module.exports = router;