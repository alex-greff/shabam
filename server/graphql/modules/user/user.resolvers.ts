import { UserAccount, Token } from "../../../types";
import UserOperations from "./user.operations";
import injectUserData from "../../middleware/userData";
import permit from "../../middleware/permission";
import * as Utilities from "../../../utilities";

// const UserOperations = require("./user.operations");
// const Utilities = require("../../../utilities");

// const injectUserData = require("../../middleware/userData");
// const permit = require("../../middleware/permission");

export default {
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
        _id: (user: UserAccount) => user.id,
        email: (user: UserAccount) => user.email,
        password: (user: UserAccount) => user.password
    },
    Token: {
        token: (t: Token) => t.token
    }
}