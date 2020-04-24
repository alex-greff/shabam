import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import KEYS from "@/keys";
import HTTPError from "@/error/HTTPError";

// Import routes
import rootRoute from "@/worker/routes";

const worker = express();

// Setup morgan (http request logger)
worker.use(morgan("dev"));

// Setup body parser
worker.use(bodyParser.urlencoded({ extended: false }));
worker.use(bodyParser.json());

// Setup CORS headers
const corsOptions = {
    origin: "*",
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
    optionsSuccessStatus: 200
};
// Handle CORS preflight options request
worker.options("*", cors(corsOptions));
// Enable CORS
worker.use(cors(corsOptions));

// Setup routes
worker.use("/", rootRoute);

// Handle 404 error
// If it gets down there, then there is no route for the given request
worker.use((req: Request, res: Response, next: NextFunction) => {
    const error = new HTTPError("Request endpoint not found");
    error.status = 404;
    next(error);
});

// Handle 500 errors
worker.use((error: HTTPError, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

export default worker;