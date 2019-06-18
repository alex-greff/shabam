const GraphQLModule = require("@graphql-modules/core").GraphQLModule;
const typeDefs = require("./user.typeDefs");
const resolvers = require("./user.resolvers");

module.exports = new GraphQLModule({
    typeDefs,
    resolvers,
});