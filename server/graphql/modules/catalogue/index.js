const GraphQLModule = require("@graphql-modules/core").GraphQLModule;
const typeDefs = require("./catalogue.typeDefs");
const resolvers = require("./catalogue.resolvers");

const headerInjector = require("../../injectors/headers");

module.exports = new GraphQLModule({
    typeDefs,
    resolvers,
    context: headerInjector
});