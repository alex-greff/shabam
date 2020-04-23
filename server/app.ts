import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors, { CorsOptions } from "cors";
import HTTPError from "./error/HTTPError";
import bodyParser from "body-parser";
import { Pool, PoolConfig } from "pg";
import AppModule from "./graphql/modules";
import KEYS from "./keys";
import { ApolloServer } from "apollo-server-express";

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

// Setup body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Setup CORS headers
// TODO: get rid of "*", super bad security!
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

// Setup graphql with Apollo server
const server = new ApolloServer({
    schema: AppModule.schema,
    // Note: Playground will be disabled automatically when NODE_ENV=production
    playground: { 
        endpoint: "/api/graphql"
    },
    uploads: {
        maxFileSize: 50000000, // 50 MB
        maxFiles: 5
    }
});

server.applyMiddleware({ 
    app,
    path: "/graphql"
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server listing on port ${port}`);
});