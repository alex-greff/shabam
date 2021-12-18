import * as Utilities from "./utilities";

export default {
  API_URL: Utilities.trailingSlash(process.env.API_URL!),
};
