import { GraphQLModule } from "@graphql-modules/core";
import typeDefs from "./catalogue.typeDefs";
import resolvers from "./catalogue.resolvers";
import headerInjector from "../../injectors/headers";

import UploadModule from "../upload";

export default new GraphQLModule({
    imports: [
        UploadModule
    ],
    typeDefs,
    resolvers,
    context: headerInjector
});