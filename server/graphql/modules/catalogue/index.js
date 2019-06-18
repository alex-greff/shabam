const GraphQLModule = require("@graphql-modules/core").GraphQLModule;
const typeDefs = require("./catalogue.typeDefs");
const resolvers = require("./catalogue.resolvers");

module.exports = new GraphQLModule({
    typeDefs,
    resolvers,
});