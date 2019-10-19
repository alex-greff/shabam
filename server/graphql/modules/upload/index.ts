import { GraphQLModule } from "@graphql-modules/core";
import typeDefs from "./upload.typeDefs";
import resolvers from "./upload.resolvers";

export default new GraphQLModule({
    typeDefs,
    resolvers
});