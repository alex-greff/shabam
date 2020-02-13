import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors, { CorsOptions } from "cors";
import HTTPError from "./error/HTTPError";
import bodyParser from "body-parser";
import { Pool, PoolConfig } from "pg";
import graphqlHttp from "express-graphql";
const { graphqlUploadExpress } = require("graphql-upload"); // No types
import AppModule from "./graphql/modules";
import KEYS from "./keys";

// const express = require("express");
// const morgan = require("morgan");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const { Pool } = require("pg");
// const graphqlHttp = require("express-graphql");
// const { graphqlUploadExpress } = require("graphql-upload");
// const KEYS = require("./keys"); // TODO: convert KEYS to TypeScript last

// const AppModule = require("./graphql/modules");

const app = express();

// Postgress client connection setup
const pgClient = new Pool({
    user: KEYS.PG_MAIN_USER,
    host: KEYS.PG_MAIN_HOST,
    database: KEYS.PG_MAIN_DATABASE,
    password: KEYS.PG_MAIN_PASSWORD,
    port: KEYS.PG_MAIN_PORT
});
pgClient.on("error", () => console.log("ERROR: lost connection to postgress database"));

// Setup morgan
app.use(morgan("dev"));

// Setup the uploads directory for temporarily storing uploaded files
app.use("/uploads", express.static("uploads"));

// Setup body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Setup CORS headers
const corsOptions = {
    origin: "*",
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
    optionsSuccessStatus: 200
};
// Handle CORS preflight options request
app.options("*", cors(corsOptions));
// Enable CORS
app.use(cors(corsOptions));

// Setup graphql
app.use(
    '/graphql', 
    graphqlUploadExpress({ 
        maxFileSize: 50000000, // 50mb
        maxFiles: 5
    }),
    graphqlHttp({
        schema: AppModule.schema,
        graphiql: !KEYS.PRODUCTION // Only use graphiql debugger page if not in production    
    })
);

// Handle 404 error
// If it gets down there, then there is no route for the given request
app.use((req, res, next) => {
    const error = new HTTPError("Route not found");
    error.status = 404;
    next(error);
});

// Handle 500 errors
app.use((error: HTTPError, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

export default app;