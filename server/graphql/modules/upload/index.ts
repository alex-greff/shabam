import { GraphQLModule } from "@graphql-modules/core";
import typeDefs from "./upload.typeDefs";
import resolvers from "./upload.resolvers";

// Reference: https://graphql-modules.com/docs/recipes/file-uploads
export default new GraphQLModule({
    typeDefs,
    resolvers
});