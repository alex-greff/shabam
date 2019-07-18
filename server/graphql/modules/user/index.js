const GraphQLModule = require("@graphql-modules/core").GraphQLModule;
const typeDefs = require("./user.typeDefs");
const resolvers = require("./user.resolvers");

const headerInjector = require("../../injectors/headers");

module.exports = new GraphQLModule({
    typeDefs,
    resolvers,
    context: headerInjector
});

