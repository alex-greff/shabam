const GraphQLModule = require("@graphql-modules/core").GraphQLModule;
const typeDefs = require("./user.typeDefs");
const resolvers = require("./user.resolvers");

const authenticationContext = (session, currentContext, moduleSessionInfo) => {
    console.log("req", session.headers);
};

module.exports = new GraphQLModule({
    typeDefs,
    resolvers,
});