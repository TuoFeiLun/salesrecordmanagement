const express = require("express");
const router = express.Router();

const controller = require("../controllers/customerController");
const validateMongoId = require("../middleware/validateMongoId");
const authenicateWithJwt = require("../middleware/authenticateWithJwt");
const validatePaginateQueryParams = require("../middleware/validatePaginateQueryParams");


router.route("/")
    .all(authenicateWithJwt)
    .get(validatePaginateQueryParams, controller.customer_list) // GET list of  
    .post(controller.customer_create); // POST create a new  

router.route("/:id")
    .all(validateMongoId('id'))
    .all(authenicateWithJwt)
    .get(controller.customer_detail) // GET one  
    .put(controller.customer_update) // PUT update an  
    .delete(controller.customer_delete); // DELETE an  

module.exports = router;