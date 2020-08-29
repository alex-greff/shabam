import { UserAccount } from "@/types/schema";
import UserOperations from "./user.operations";
import permit from "@/graphql/middleware/permission";
import * as Utilities from "@/utilities";

export default {
  Query: {
    checkUsernameAvailability: Utilities.middlewareChain()(
      UserOperations.checkAvailability
    ),
  },
  Mutation: {
    login: Utilities.middlewareChain()(UserOperations.login),
    logout: Utilities.middlewareChain()(UserOperations.logout),
    signup: Utilities.middlewareChain()(UserOperations.signup),
    editUser: Utilities.middlewareChain(permit({}, "edit-user", "edit-self"))(
      UserOperations.editUser
    ),
    editUserRole: Utilities.middlewareChain(permit({}, "edit-user-roles"))(
      UserOperations.editUserRole
    ),
    removeUser: Utilities.middlewareChain(
      permit({}, "delete-user", "delete-self")
    )(UserOperations.removeUser),
  },
  User: {
    _id: (user: UserAccount) => user.id,
    username: (user: UserAccount) => user.username,
    password: (user: UserAccount) => user.password,
  },
};