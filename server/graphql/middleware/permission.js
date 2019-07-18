const canDoAllOperations = require("../../roles/role-check");
const Utilities = require("../../utilities");
const db = require("../../db");

const DEFAULT_CHECK_CONFIG = {
    checkSelf: false,
    userEmailPath: "email"
};

module.exports = (checkConfig, ...operations) => {
    return async (root, args, context) => {
        try {
            checkConfig = { ...DEFAULT_CHECK_CONFIG, ...checkConfig };

            // Check if there is an email given
            if (!context.userData.email) {
                Utilities.throwAuthorizationError();
            }

            // Get the user's role
            const getUserQuery = await db.query("SELECT role, email FROM user_account AS ua WHERE ua.email = %L", `${context.userData.email}`);

            // Check that user exists
            if (getUserQuery.rowCount <= 0) {
                Utilities.throwAuthorizationError();
            }

            const { role, email: userEmail } = getUserQuery.rows[0];

            const { checkSelf, userEmailPath } = checkConfig;
            const checkUserEmail = Utilities.getIn(args, userEmailPath);

            // Check if user has access
            if (context.userData && canDoAllOperations(role, ...operations)) {
                context.userAccessType = "role";
            }
            // Check if the user is self
            else if (checkSelf && checkUserEmail && userEmail === checkUserEmail) {
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