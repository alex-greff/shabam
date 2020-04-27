import { GraphQLModule } from "@graphql-modules/core";

// Modules
import CatalogueModule from "./catalogue";
import UserModule from "./user";

export default new GraphQLModule({
    imports: [
        CatalogueModule,
        UserModule
    ],
    context: ({ req, res }) => ({ req, res })
});