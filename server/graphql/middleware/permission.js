const jwt = require('jsonwebtoken');
const canDoAllOperations = require("../../roles/role-check");
const Utilities = require("../../utilities");
const db = require("../../db");
const KEYS = require("../../keys");

const DEFAULT_CHECK_CONFIG = {
    checkSelf: false,
    userIDPath: "userID"
};

module.exports = (checkConfig, ...operations) => {
    return async (root, args, context) => {
        try {
            checkConfig = { ...DEFAULT_CHECK_CONFIG, ...checkConfig };

            // Validate token
            const token = context.authorization.split(" ")[1];
            const decoded = jwt.verify(token, KEYS.jwtSecret);
            context.userData = { userID: decoded.userID };

            // Get the user's role
            const getUserQuery = await db.query("SELECT role, user_account_id FROM user_account AS ua WHERE ua.user_account_id = %L", `${context.userData.userID}`);

            // Check that user exists
            if (getUserQuery.rowCount <= 0) {
                Utilities.throwAuthorizationError();
            }

            const { role, user_account_id: userID } = getUserQuery.rows[0];

            const { checkSelf, userIDPath } = checkConfig;
            const checkUserID = Utilities.getIn(args, userIDPath);

            // Check if user has access
            if (context.userData && canDoAllOperations(role, ...operations)) {
                context.userAccessType = "role";
            }
            // Check if the user is self
            else if (checkSelf && checkUserID && userID === checkUserID) {
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