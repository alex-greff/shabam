import { RoleCheckConfig, AppContext } from "@/types";
import * as Utilities from "@/utilities";
import * as catalogueHelpers from "@/graphql/modules/catalogue/catalogue.helpers";

const checkTrackIsOwned = async (
  root: any,
  args: any,
  context: AppContext,
  config: RoleCheckConfig
): Promise<boolean> => {
  const { trackID: nTrackID } = args;
  const userUsername = context.req.session?.userData?.username;

  if (!userUsername) throw new Error("User username does not exist");

  // Get the uploader user's username of the track that will be potentially edited
  const oTrackData = await catalogueHelpers.getTrack(nTrackID);
  const { uploaderUsername } = oTrackData.metaData;

  // Check if the uploader's username is the same as the current user
  return uploaderUsername === userUsername;
};

const checkIsSelf = (
  root: any,
  args: any,
  context: AppContext,
  config: RoleCheckConfig
): boolean => {
  const { userUsernamePath } = config;
  const targetUserUsername = Utilities.getIn(args, userUsernamePath);

  const userUsername = context.req.session?.userData?.username;

  if (!userUsername) throw new Error("User username does not exist");

  // Compare the target username with the username of the current user
  return targetUserUsername === userUsername;
};

export default {
  "edit-owned-track": checkTrackIsOwned,
  "delete-owned-track": checkTrackIsOwned,
  "edit-self": checkIsSelf,
  "delete-self": checkIsSelf,
};
