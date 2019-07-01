const UserOperations = require("./user.operations");
const Utilities = require("../../utilities");

module.exports = {
    Query: {
        login: Utilities.middlewareChain()(UserOperations.login),
    },
    Mutation: { 
        signup: Utilities.middlewareChain()(UserOperations.signup),
        editUser: Utilities.middlewareChain()(UserOperations.editUser),
        removeUser: Utilities.middlewareChain()(UserOperations.removeUser),
    }
}