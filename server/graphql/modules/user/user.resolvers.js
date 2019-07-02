const UserOperations = require("./user.operations");
const Utilities = require("../../../utilities");
const permit = require("../../middleware/permission");

module.exports = {
    Query: {
        login: Utilities.middlewareChain()(UserOperations.login),
    },
    Mutation: { 
        signup: Utilities.middlewareChain()(UserOperations.signup),
        editUser: Utilities.middlewareChain(permit({ checkSelf: true }, "edit-user"))(UserOperations.editUser),
        editUserRole: Utilities.middlewareChain(permit({ checkSelf: false }, "edit-user-roles"))(UserOperations.editUserRole),
        removeUser: Utilities.middlewareChain(permit({ checkSelf: true }, "delete-user"))(UserOperations.removeUser),
    }
}