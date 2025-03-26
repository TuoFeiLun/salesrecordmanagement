const express = require("express");
const mongoose = require("mongoose");
var fs = require('fs');
var morgan = require('morgan');
var path = require('path');

const indexRouter = require("./src/routes/index");

const app = express();

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

const mongoDB = process.env.MONGODB_URI || "mongodb://localhost:27017/carsalemanagement";

main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect(mongoDB);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    console.log(`Received request for route: ${req.originalUrl}`);
    next()
});

app.use("/api", indexRouter);

const PORT = 4008;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;