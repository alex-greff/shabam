const UserOperations = require("./user.operations");

module.exports = {
    Query: {
        login: (root, { userCredentials }, context) => UserOperations.login(userCredentials),
    },
    Mutation: {
        signup: (root, { userCredentials }, context) => UserOperations.signup(userCredentials),
        editUser: (root, { userID, updatedUserCredentials }, context) => UserOperations.editUser(userID, updatedUserCredentials),
        removeUser: (root, { userID }, context) => UserOperations.removeUser(userID),
    }
}