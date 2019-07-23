const express = require("express");
const worker = express();
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const morgan = require("morgan");
const cors = require("cors");
const KEYS = require("./keys");

// Import routes
const rootRoute = require("./worker/routes");

// Setup morgan (http request logger)
worker.use(morgan("dev"));

// Setup body parser
worker.use(bodyParser.urlencoded({ extended: false }));
worker.use(bodyParser.json());

// Setup express-validator
worker.use(expressValidator());

// Setup CORS headers
const corsOptions = {
    origin: "*",
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
    optionsSuccessStatus: 200
};
// Handle CORS preflight options request
worker.options(cors(corsOptions));
// Enable CORS
worker.use(cors(corsOptions));

// Setup routes
worker.use("/", rootRoute);

// Handle 404 error
// If it gets down there, then there is no route for the given request
worker.use((req, res, next) => {
    const error = new Error("Request endpoint not found");
    error.status = 404;
    next(error);
});

// Handle 500 errors
worker.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = worker;