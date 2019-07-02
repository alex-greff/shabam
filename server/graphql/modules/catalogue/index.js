const GraphQLModule = require("@graphql-modules/core").GraphQLModule;
const typeDefs = require("./catalogue.typeDefs");
const resolvers = require("./catalogue.resolvers");

const authorizationInjector = require("../../injectors/authorization");

module.exports = new GraphQLModule({
    typeDefs,
    resolvers,
    context: authorizationInjector
});