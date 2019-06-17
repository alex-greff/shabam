const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const graphqlHttp = require("express-graphql");
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");
const KEYS = require("./keys");

// Postgress client connection setup
const pgClient = new Pool({
    user: KEYS.pgUser,
    host: KEYS.pgHost,
    database: KEYS.pgDatabase,
    password: KEYS.pgPassword,
    port: KEYS.pgPort
});
pgClient.on("error", () => console.log("ERROR: lost connection to postgress database"));

// Setup morgan
app.use(morgan("dev"));

// Setup the uploads directory for temporarily storing uploaded files
app.use("/uploads", express.static("uploads"));

// Setup body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

// Setup graphql
app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: !KEYS.PRODUCTION // Only use graphiql debugger page if not in production
}));

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