const Utilities = require("../utilities");
const catalogueHelpers = require("../graphql/modules/catalogue/catalogue.helpers");
const userHelpers = require("../graphql/modules/user/user.helpers");

const checkTrackIsOwned = async (root, args, context, config) => {
    const { title: trackTitle, artists: trackArtists } = args;
    const userEmail = context.userData.email;

    // Get the uploader user's email of the track that will be potentially edited
    const nTrackID = await catalogueHelpers.findTrackID(trackTitle, trackArtists);
    const oTrackData = await catalogueHelpers.getTrack(nTrackID);
    const { uploaderEmail } = oTrackData.metaData;

    // Check if the uploader's email is the same as the current user
    return (uploaderEmail === userEmail);
};

const checkIsSelf = (root, args, context, config) => {
    const { userEmailPath } = config;
    const targetUserEmail = Utilities.getIn(args, userEmailPath);

    const { email: userEmail } = context.userData;

    // Compare the target email with the email of the current user
    return (targetUserEmail === userEmail);
};

module.exports = {
    "edit-owned-track": checkTrackIsOwned,
    "delete-owned-track": checkTrackIsOwned,
    "edit-self": checkIsSelf,
    "delete-self": checkIsSelf,
};