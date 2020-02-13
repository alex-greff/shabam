import { UserDataContext, RoleCheckConfig } from "../types";
import * as Utilities from "../utilities";
import * as catalogueHelpers from "../graphql/modules/catalogue/catalogue.helpers";

// const Utilities = require("../utilities");
// const catalogueHelpers = require("../graphql/modules/catalogue/catalogue.helpers");
// const userHelpers = require("../graphql/modules/user/user.helpers");

const checkTrackIsOwned = async (root: any, args: any, context: UserDataContext, config: any): Promise<boolean> => {
    const { trackID: nTrackID } = args;
    const userEmail = context.userData.email;

    // Get the uploader user's email of the track that will be potentially edited
    const oTrackData = await catalogueHelpers.getTrack(nTrackID);
    const { uploaderEmail } = oTrackData.metaData;

    // Check if the uploader's email is the same as the current user
    return (uploaderEmail === userEmail);
};

const checkIsSelf = (root: any, args: any, context: UserDataContext, config: RoleCheckConfig): boolean => {
    const { userEmailPath } = config;
    const targetUserEmail = Utilities.getIn(args, userEmailPath);

    const { email: userEmail } = context.userData;

    // Compare the target email with the email of the current user
    return (targetUserEmail === userEmail);
};

export default {
    "edit-owned-track": checkTrackIsOwned,
    "delete-owned-track": checkTrackIsOwned,
    "edit-self": checkIsSelf,
    "delete-self": checkIsSelf,
}