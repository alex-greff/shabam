<<<<<<< HEAD:server/roles/custom-role-checks.ts
import { UserDataContext, RoleCheckConfig } from "../index";
import * as Utilities from "../utilities";
import * as catalogueHelpers from "../graphql/modules/catalogue/catalogue.helpers";

async function checkTrackIsOwned(root: any, args: any, context: UserDataContext, config: any): Promise<boolean> {
=======
import { UserDataContext, RoleCheckConfig } from "../types";
import * as Utilities from "../utilities";
import * as catalogueHelpers from "../graphql/modules/catalogue/catalogue.helpers";

// const Utilities = require("../utilities");
// const catalogueHelpers = require("../graphql/modules/catalogue/catalogue.helpers");
// const userHelpers = require("../graphql/modules/user/user.helpers");

const checkTrackIsOwned = async (root: any, args: any, context: UserDataContext, config: any): Promise<boolean> => {
>>>>>>> typescript:server/roles/custom-role-checks.js
    const { trackID: nTrackID } = args;
    const userEmail = context.userData.email;

    // Get the uploader user's email of the track that will be potentially edited
    const oTrackData = await catalogueHelpers.getTrack(nTrackID);
    const { uploaderEmail } = oTrackData.metaData;

    // Check if the uploader's email is the same as the current user
    return (uploaderEmail === userEmail);
};

<<<<<<< HEAD:server/roles/custom-role-checks.ts
function checkIsSelf(root: any, args: any, context: UserDataContext, config: RoleCheckConfig): boolean {
=======
const checkIsSelf = (root: any, args: any, context: UserDataContext, config: RoleCheckConfig): boolean => {
>>>>>>> typescript:server/roles/custom-role-checks.js
    const { userEmailPath } = config;
    const targetUserEmail = Utilities.getIn(args, userEmailPath);

    const { email: userEmail } = context.userData;

    // Compare the target email with the email of the current user
    return (targetUserEmail === userEmail);
};

<<<<<<< HEAD:server/roles/custom-role-checks.ts
const customRoleChecks: any = {
=======
export default {
>>>>>>> typescript:server/roles/custom-role-checks.js
    "edit-owned-track": checkTrackIsOwned,
    "delete-owned-track": checkTrackIsOwned,
    "edit-self": checkIsSelf,
    "delete-self": checkIsSelf,
}

export default customRoleChecks;