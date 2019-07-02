module.exports = (session, currentContext, moduleSessionInfo) => {
    return {
        authorization: session.headers["authorization"]
    };
}