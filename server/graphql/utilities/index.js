exports.middlewareChain = (...middlewares) => {
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