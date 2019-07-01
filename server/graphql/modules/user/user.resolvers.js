const UserOperations = require("./user.operations");
const GraphQLUtilities = require("../../utilities");

module.exports = {
    Query: {
        login: GraphQLUtilities.middlewareChain()(UserOperations.login),
    },
    Mutation: { 
        signup: GraphQLUtilities.middlewareChain()(UserOperations.signup),
        editUser: GraphQLUtilities.middlewareChain()(UserOperations.editUser),
        removeUser: GraphQLUtilities.middlewareChain()(UserOperations.removeUser),
    }
}