import { GraphQLModule } from "@graphql-modules/core";
import typeDefs from "./catalogue.typeDefs";
import resolvers from "./catalogue.resolvers";

import UploadScalar from "@/graphql/scalars/upload";
import DateScalar from "@/graphql/scalars/date";

export default new GraphQLModule({
    imports: [
        UploadScalar,
        DateScalar
    ],
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ req, res })
});