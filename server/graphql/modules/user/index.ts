import { GraphQLModule } from "@graphql-modules/core";
import typeDefs from "./user.typeDefs";
import resolvers from "./user.resolvers";

import headerInjector from "../../injectors/headers";

export default new GraphQLModule({
    typeDefs,
    resolvers,
    context: headerInjector
});

