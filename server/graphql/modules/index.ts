import { GraphQLModule } from "@graphql-modules/core";

// Modules
const CatalogueModule = require("./catalogue");
const UserModule = require("./user");

export default new GraphQLModule({
    imports: [
        CatalogueModule,
        UserModule
    ]
});