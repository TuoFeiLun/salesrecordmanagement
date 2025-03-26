const express = require("express");
const router = express.Router();

const controller = require("../controllers/salesrecordController");
const validateMongoId = require("../middleware/validateMongoId");
const authenticateWithJwt = require("../middleware/authenticateWithJwt");

router.route("/")
    .get(controller.salesrecord_list) // GET list of  
    .post(authenticateWithJwt, controller.salesrecord_create); // POST create a new  

router.route("/:id")
    .all(validateMongoId('id'))
    .all(authenticateWithJwt)
    .get(controller.salesrecord_detail) // GET one  
    .put(controller.salesrecord_update) // PUT update an  
    .delete(controller.salesrecord_delete); // DELETE an  

module.exports = router;