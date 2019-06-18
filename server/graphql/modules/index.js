const GraphQLModule = require("@graphql-modules/core").GraphQLModule;

// Modules
const CatalogueModule = require("./catalogue");
const UserModule = require("./user");

module.exports = new GraphQLModule({
    imports: [
        CatalogueModule,
        UserModule
    ]
});