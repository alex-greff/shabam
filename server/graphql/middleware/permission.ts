<<<<<<< HEAD:server/graphql/middleware/permission.ts
import { RoleCheckConfig, UserDataContext } from "../../index";
import canDoAllOperations from "../../roles/role-check";
import * as Utilities from "../../utilities";

=======
import { RoleCheckConfig, UserDataContext } from "../../types";
import canDoAllOperations from "../../roles/role-check";
import * as Utilities from "../../utilities";

// const canDoAllOperations = require("../../roles/role-check");
// const Utilities = require("../../utilities");

>>>>>>> typescript:server/graphql/middleware/permission.js
const DEFAULT_CHECK_CONFIG: RoleCheckConfig = {
    userEmailPath: "email"
};

<<<<<<< HEAD:server/graphql/middleware/permission.ts
export default function (config: object, ...operations: string[]) {
=======
export default (config: object, ...operations: string[]) => {
>>>>>>> typescript:server/graphql/middleware/permission.js
    return async (root: any, args: any, context: UserDataContext) => {
        try {
            config = (config) ? { ...DEFAULT_CHECK_CONFIG, ...config } : { ...DEFAULT_CHECK_CONFIG };

            // Check if there user data provided
            if (!context.userData) {
                Utilities.throwAuthorizationError();
            }

            const { role } = context.userData;

            // Check if user has access
            if (!(await canDoAllOperations(root, args, context)(config as RoleCheckConfig, role, ...operations))) {
                Utilities.throwAuthorizationError();
            }
        } catch (error) {
            Utilities.throwAuthorizationError();
        }
    }
}