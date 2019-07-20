const jwt = require('jsonwebtoken');
const KEYS = require("../../keys");

// Decodes the JWT token and injects the given user data into the context
module.exports = (root, args, context) => {
    const tokenRaw = context.headers["authorization"];

    if (!tokenRaw) {
        throw new Error("Authorization token not provided");
    }

    const token = tokenRaw.split(" ")[1];
    const decoded = jwt.verify(token, KEYS.jwtSecret);

    const userData = {
        email: decoded.email
    };

    // Inject user data into the context
    context["userData"] = userData;
};