const jwt = require('jsonwebtoken');
const KEYS = require("../../keys");

module.exports = (session, currentContext, moduleSessionInfo) => {
    const tokenRaw = session.headers["authorization"];

    const userData = {};

    if (tokenRaw) {
        const token = tokenRaw.split(" ")[1];
        const decoded = jwt.verify(token, KEYS.jwtSecret);

        userData.email = decoded.email;
    }

    return {
        authorization: tokenRaw,
        userData: { ...userData }
    };
}