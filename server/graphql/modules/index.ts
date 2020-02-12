import { GraphQLModule } from "@graphql-modules/core";

// Modules
import CatalogueModule from "./catalogue";
import UserModule from "./user";

// console.log('CatalogueModule', CatalogueModule);

// const GraphQLModule = require("@graphql-modules/core").GraphQLModule;

// Modules
// const CatalogueModule = require("./catalogue");
// const UserModule = require("./user");

export default new GraphQLModule({
    imports: [
        CatalogueModule,
        UserModule
    ]
});