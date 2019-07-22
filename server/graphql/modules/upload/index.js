const GraphQLModule = require("@graphql-modules/core").GraphQLModule;
const typeDefs = require("./upload.typeDefs");
const resolvers = require("./upload.resolvers");

module.exports = new GraphQLModule({
    typeDefs,
    resolvers
});