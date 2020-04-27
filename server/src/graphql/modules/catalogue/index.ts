import { GraphQLModule } from "@graphql-modules/core";
import typeDefs from "./catalogue.typeDefs";
import resolvers from "./catalogue.resolvers";

import UploadModule from "@/graphql/modules/upload";

export default new GraphQLModule({
    imports: [
        UploadModule
    ],
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res })
});