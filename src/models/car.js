const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CarScheme = new Schema({
    brandname: { type: String, required: true },
    cartype: { type: String, required: true },
    price: { type: Number, required: true },
    productionarea: { type: String, required: true },

});

// Export model.
module.exports = mongoose.model("Car", CarScheme);