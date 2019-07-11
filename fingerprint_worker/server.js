const http = require("http");
const worker = require("./worker");

// Setup server

const port = process.env.PORT || 5001;

const server = http.createServer(worker);

server.listen(port);

console.log(`Fingerprint server running on port ${port}`);