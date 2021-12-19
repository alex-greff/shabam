import * as dotenv from "dotenv";

dotenv.config();

export default {
  GRAPHQL_API_URL: process.env.GRAPHQL_API_URL!,
};
