// This injector grabs all the headers of the current request and injects them into the context
module.exports = (session, currentContext, moduleSessionInfo) => {
    const headers = { ...session.headers };

    return {
        headers
    };
};