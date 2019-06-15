const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const KEYS = require("./keys");

// Import routes
const searchRoutes = require("./api/routes/search");
const catalogueRoutes = require("./api/routes/catalogue");

// Setup morgan
app.use(morgan("dev"));

// Setup the uploads directory for temporarily storing uploaded files
app.use("/uploads", express.static("uploads"));

// Setup body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Setup express validator
app.use(expressValidator());

// Setup headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

// Setup routes
app.use("/api/search", searchRoutes);
app.use("/api/catalogue", catalogueRoutes);

// Handle 404 error
// If it gets down there, then there is no route for the given request
app.use((req, res, next) => {
    const error = new Error("Route not found");
    error.status = 404;
    next(error);
});

// Handle 500 errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;