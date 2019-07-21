const UserOperations = require("./user.operations");
const Utilities = require("../../../utilities");

const injectUserData = require("../../middleware/userData");
const permit = require("../../middleware/permission");

module.exports = {
    Query: {
        login: Utilities.middlewareChain()(UserOperations.login),
    },
    Mutation: { 
        signup: Utilities.middlewareChain()(UserOperations.signup),
        editUser: Utilities.middlewareChain(injectUserData, permit({}, "edit-user", "edit-self"))(UserOperations.editUser),
        editUserRole: Utilities.middlewareChain(injectUserData, permit({}, "edit-user-roles"))(UserOperations.editUserRole),
        removeUser: Utilities.middlewareChain(injectUserData, permit({}, "delete-user", "delete-self"))(UserOperations.removeUser),
    },
    User: {
        _id: user => user.id,
        email: user => user.email,
        password: user => user.password
    },
    Token: {
        token: t => t.token
    }
}