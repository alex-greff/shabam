const canDoAllOperations = require("../../roles/role-check");
const Utilities = require("../../utilities");
const db = require("../../db");
const userHelpers = require("../modules/user/user.helpers");

const DEFAULT_CHECK_CONFIG = {
    checkSelf: false,
    userEmailPath: "email"
};

module.exports = (config, ...operations) => {
    return async (root, args, context) => {
        try {
            config = { ...DEFAULT_CHECK_CONFIG, ...config };

            // Check if there is an email given
            if (!context.userData || !context.userData.email) {
                Utilities.throwAuthorizationError();
            }

            // Get the user's data
            const oUserData = await userHelpers.getUser(`${context.userData.email}`);

            // Check that user exists
            if (!oUserData) {
                Utilities.throwAuthorizationError();
            }

            const { role, email: userEmail } = oUserData;

            const { checkSelf, userEmailPath } = config;
            const providedUserEmail = Utilities.getIn(args, userEmailPath);

            // Check if user has access
            if (await canDoAllOperations(root, args, context)(config, role, ...operations)) {
                context.userAccessType = "role";
            }
            // Check if the user is self
            else if (checkSelf && providedUserEmail && userEmail === providedUserEmail) {
                context.userAccessType = "self";
            }
            else {
                Utilities.throwAuthorizationError();
            }
        } catch (error) {
            Utilities.throwAuthorizationError();
        }
    }
}