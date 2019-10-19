import express, { Router, Request, Response, NextFunction, RequestHandler } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors, { CorsOptions } from "cors";
import KEYS from "./keys";
import HTTPError from "./src/error/HTTPError";

// Import routes
import rootRoute from "./src/routes";

const app = express();

// Setup morgan (http request logger)
app.use(morgan("dev"));

// Setup body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Setup CORS headers
const corsOptions: CorsOptions = {
    origin: "*",
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
    optionsSuccessStatus: 200
};
// Handle CORS preflight options request
app.options("*", cors(corsOptions));

// Enable CORS
app.use(cors(corsOptions));

// Setup routes
app.use("/", rootRoute);

// Handle 404 error
// If it gets down there, then there is no route for the given request
app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new HTTPError("Request endpoint not found");
    error.status = 404;
    next(error);
});

// Handle 500 errors
app.use((error : HTTPError, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

// module.exports = app;
export default app;