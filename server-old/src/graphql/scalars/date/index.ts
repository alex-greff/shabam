import { GraphQLModule } from "@graphql-modules/core";
import typeDefs from "./date.typeDefs";
import resolvers from "./date.resolvers";

// Reference: https://www.apollographql.com/docs/graphql-tools/scalars/
export default new GraphQLModule({
  typeDefs,
  resolvers,
});
