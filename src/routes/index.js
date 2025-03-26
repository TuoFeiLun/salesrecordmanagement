const express = require("express");

const AuthenticationRouter = require("./auth");
const CarRouter = require("./car");
const CustomerRouter = require("./customer");
const SalesrecordRouter = require("./salesrecord");
const router = express.Router();


router.use('/cars', CarRouter);
router.use('/customer', CustomerRouter);
router.use('/salesrecord', SalesrecordRouter);
router.use('/auth', AuthenticationRouter);

module.exports = router;