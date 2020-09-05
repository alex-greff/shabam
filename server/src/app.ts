import { SESSION_EXPIRE_LENGTH } from "@/constants";
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import cors, { CorsOptions } from "cors";
import HTTPError from "@/error/HTTPError";
import bodyParser from "body-parser";
import { Pool, PoolConfig } from "@/db/metadata/node_modules/pg";
import AppModule from "@/graphql/modules";
import KEYS from "@/keys";
import { ApolloServer } from "apollo-server-express";
import session from "express-session";
import redis from "redis";
import connectRedis from "connect-redis";

const app = express();

// TODO: remove this
// Postgres client connection setup
const pgClient = new Pool({
  user: KEYS.PG_MAIN_USER,
  host: KEYS.PG_MAIN_HOST,
  database: KEYS.PG_MAIN_DATABASE,
  password: KEYS.PG_MAIN_PASSWORD,
  port: KEYS.PG_MAIN_PORT,
});
pgClient.on("error", () =>
  console.log("ERROR: lost connection to postgress database")
);

// Setup body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// For express session to work properly behind the proxy
app.set("trust proxy", 1);

// Setup express session with Redis as the store
let RedisStore = connectRedis(session);
let redisSessionClient = redis.createClient({
  host: KEYS.REDIS_SESSION_HOST,
  port: KEYS.REDIS_SESSION_PORT,
  password: KEYS.REDIS_SESSION_PASSWORD,
});

app.use(
  session({
    store: new RedisStore({ client: redisSessionClient }),
    secret: KEYS.SESSION_SECRET,
    cookie: {
      sameSite: false,
      httpOnly: true,
      secure: KEYS.PRODUCTION ? true : false,
      expires: new Date(Date.now() + SESSION_EXPIRE_LENGTH),
    },
    saveUninitialized: false,
    resave: true,
  })
);

// Setup morgan
app.use(morgan("dev"));

// Setup CORS headers
// TODO: get rid of "*", super bad security!
const corsOptions = {
  origin: "*",
  methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  optionsSuccessStatus: 200,
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
    endpoint: "/api/graphql",
  },
  uploads: {
    maxFileSize: 50000000, // 50 MB
    maxFiles: 5,
  },
  context: ({ req, res }) => ({ req, res }),
});

server.applyMiddleware({
  app,
  path: "/graphql",
});

// Setup the server port

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listing on port ${port}`);
});
