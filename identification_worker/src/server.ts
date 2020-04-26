import http from "http";
import worker from "./worker";

// Setup server

const port = process.env.PORT || 5002;

const server = http.createServer(worker);

server.listen(port);