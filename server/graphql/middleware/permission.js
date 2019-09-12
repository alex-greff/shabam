const canDoAllOperations = require("../../roles/role-check");
const Utilities = require("../../utilities");
const db = require("../../db/main");
const userHelpers = require("../modules/user/user.helpers");

const DEFAULT_CHECK_CONFIG = {
    userEmailPath: "email"
};

module.exports = (config, ...operations) => {
    return async (root, args, context) => {
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