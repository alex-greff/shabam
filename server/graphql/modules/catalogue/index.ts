import { GraphQLModule, GraphQLModuleOptions } from "@graphql-modules/core";
import typeDefs from "./catalogue.typeDefs";
import resolvers from "./catalogue.resolvers";

import UploadModule from "../upload";
import headerInjector from "../../injectors/headers";

export default new GraphQLModule({
    imports: [
        UploadModule
    ],
    typeDefs,
    resolvers,
    context: headerInjector
});