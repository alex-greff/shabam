const KEYS = require("../../keys");

/**
 * Setups a chain of middlewares. 
 * Returns a function that takes a resolver which is called at the end of the middleware chain.
 * 
 * @param  {...Function} middlewares The middlewares to call.
 */
exports.middlewareChain = (...middlewares) => {
    /**
     * The construction function that takes the end-resolver
     * 
     * @param {*} resolver The resolver that is called.
     */
    return (resolver) => {
        return async (root, args, context) => {
            for (let i=0; i < middlewares.length; i++) {
                const currMiddleware = middlewares[i];
                await currMiddleware(root, args, context);
            }

            return await resolver(root, args, context);
        };
    };
};