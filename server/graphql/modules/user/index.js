const GraphQLModule = require("@graphql-modules/core").GraphQLModule;
const typeDefs = require("./user.typeDefs");
const resolvers = require("./user.resolvers");

const authorizationInjector = (req) => {
    return {
        authorization: req.headers["authorization"]
    };
}

module.exports = new GraphQLModule({
    typeDefs,
    resolvers,
    context: authorizationInjector,
});

