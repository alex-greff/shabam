import * as Utilities from "./utilities";

export default {
  GRAPHQL_API_URL: Utilities.trailingSlash(process.env.GRAPHQL_API_URL!),
};
