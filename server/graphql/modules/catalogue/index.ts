import { GraphQLModule } from "@graphql-modules/core";
import typeDefs from "./catalogue.typeDefs";

import UploadModule from "../upload";

// const GraphQLModule = require("@graphql-modules/core").GraphQLModule;
// const typeDefs = require("./catalogue.typeDefs");
const resolvers = require("./catalogue.resolvers");

// const UploadModule = require("../upload");
const headerInjector = require("../../injectors/headers");

export default new GraphQLModule({
    imports: [
        UploadModule
    ],
    typeDefs,
    resolvers,
    context: headerInjector
});