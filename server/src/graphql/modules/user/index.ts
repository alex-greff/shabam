import { GraphQLModule } from "@graphql-modules/core";
import typeDefs from "./user.typeDefs";
import resolvers from "./user.resolvers";

export default new GraphQLModule({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res }),
});
