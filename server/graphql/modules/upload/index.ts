import { GraphQLModule } from "@graphql-modules/core";
import typeDefs from "./upload.typeDefs";

// const GraphQLModule = require("@graphql-modules/core").GraphQLModule;
// const typeDefs = require("./upload.typeDefs");
const resolvers = require("./upload.resolvers");

export default new GraphQLModule({
    typeDefs,
    resolvers
});