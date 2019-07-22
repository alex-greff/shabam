const GraphQLModule = require("@graphql-modules/core").GraphQLModule;
const typeDefs = require("./catalogue.typeDefs");
const resolvers = require("./catalogue.resolvers");

const UploadModule = require("../upload");
const headerInjector = require("../../injectors/headers");

module.exports = new GraphQLModule({
    imports: [
        UploadModule
    ],
    typeDefs,
    resolvers,
    context: headerInjector
});