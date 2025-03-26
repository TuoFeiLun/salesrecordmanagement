const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const CustomerScheme = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    cars: [{ type: Schema.ObjectId, ref: "Car" }],
    createdBy: { type: Schema.ObjectId, ref: "User" }
});

CustomerScheme.plugin(paginate);

// Export model.
module.exports = mongoose.model("Customer", CustomerScheme);