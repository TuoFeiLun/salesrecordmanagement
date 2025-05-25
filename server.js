const express = require("express");
const mongoose = require("mongoose");
var fs = require('fs');
var morgan = require('morgan');
var path = require('path');
const { authLimiter, apiLimiter, createLimiter } = require('./src/middleware/rateLimiter');

const indexRouter = require("./src/routes/index");

const cors = require("cors");

const app = express();

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

// const mongoDB = process.env.MONGODB_URI || "mongodb://localhost:27017/carsalemanagement";
const mongoDB = process.env.MONGODB_URI || "mongodb://localhost:27017/carmanagement3";
main().catch((err) => console.log(err));

async function main() {
    await mongoose.connect(mongoDB);
}
app.use(cors());
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Apply rate limiting
app.use('/api/auth', authLimiter); // Stricter limits for authentication endpoints
app.use('/api', apiLimiter); // General API rate limiting

// Apply create operation rate limiting to specific routes
app.use('/api/customers/create', createLimiter);
app.use('/api/cars/create', createLimiter);
app.use('/api/salesrecords/create', createLimiter);

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