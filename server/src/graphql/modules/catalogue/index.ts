import { GraphQLModule } from "@graphql-modules/core";
import typeDefs from "./catalogue.typeDefs";
import resolvers from "./catalogue.resolvers";
import headerInjector from "@/graphql/injectors/headers";

import UploadModule from "@/graphql/modules/upload";

export default new GraphQLModule({
    imports: [
        UploadModule
    ],
    typeDefs,
    resolvers,
    context: headerInjector
});