import { RoleCheckConfig, UserDataContext } from "../../index";
import canDoAllOperations from "../../roles/role-check";
import * as Utilities from "../../utilities";
import db from "../../db/main";
import * as userHelpers from "../modules/user/user.helpers";

// const canDoAllOperations = require("../../roles/role-check");
// const Utilities = require("../../utilities");
// const db = require("../../db/main");
// const userHelpers = require("../modules/user/user.helpers");

const DEFAULT_CHECK_CONFIG: RoleCheckConfig = {
    userEmailPath: "email"
};

export default function (config: RoleCheckConfig, ...operations: string[]) {
    return async (root: any, args: any, context: UserDataContext) => {
        try {
            config = (config) ? { ...DEFAULT_CHECK_CONFIG, ...config } : { ...DEFAULT_CHECK_CONFIG };

            // Check if there user data provided
            if (!context.userData) {
                Utilities.throwAuthorizationError();
            }

            const { role } = context.userData;

            // Check if user has access
            if (!(await canDoAllOperations(root, args, context)(config, role, ...operations))) {
                Utilities.throwAuthorizationError();
            }
        } catch (error) {
            Utilities.throwAuthorizationError();
        }
    }
}