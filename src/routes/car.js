const express = require("express");
const router = express.Router();

const controller = require("../controllers/carController");
const carInfoSearchController = require("../controllers/carInfoSearchController");
const validateMongoId = require("../middleware/validateMongoId");
const authenticateWithJwt = require("../middleware/authenticateWithJwt");


router.route("/")
    .get(controller.car_list) // GET list of all Authors
    .post(authenticateWithJwt, controller.car_create); // POST create a new Author

// all user can search car info
router.route("/info/search")
    .get(carInfoSearchController.car_info_search);

router.route("/:id")
    .all(validateMongoId('id'))
    .all(authenticateWithJwt)
    .get(controller.car_detail) // GET one Author
    .put(controller.car_update) // PUT update an Author
    .delete(controller.car_delete); // DELETE an Author

module.exports = router;