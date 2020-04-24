import { UserAccount, Token } from "@/types";
import UserOperations from "./user.operations";
import injectUserData from "@/graphql/middleware/userData";
import permit from "@/graphql/middleware/permission";
import * as Utilities from "@/utilities";

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