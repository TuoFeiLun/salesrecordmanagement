const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SalesrecordScheme = new Schema({

    car: { type: Schema.ObjectId, ref: "Car", required: true },
    buyer: { type: Schema.ObjectId, ref: "Customer", required: true },
    salesman: { type: String, required: true },
    purchasedate: { type: Date, default: Date.now },
    transactionprice: { type: Number, required: true }

});

module.exports = mongoose.model("Salesrecord", SalesrecordScheme)

