import { UserAccount, Token } from "@/types/schema";
import UserOperations from "./user.operations";
import permit from "@/graphql/middleware/permission";
import * as Utilities from "@/utilities";

export default {
    Query: {
        login: Utilities.middlewareChain()(UserOperations.login),
    },
    Mutation: { 
        signup: Utilities.middlewareChain()(UserOperations.signup),
        editUser: Utilities.middlewareChain(permit({}, "edit-user", "edit-self"))(UserOperations.editUser),
        editUserRole: Utilities.middlewareChain(permit({}, "edit-user-roles"))(UserOperations.editUserRole),
        removeUser: Utilities.middlewareChain(permit({}, "delete-user", "delete-self"))(UserOperations.removeUser),
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