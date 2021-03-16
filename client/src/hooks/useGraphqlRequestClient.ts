import KEYS from "@/keys";
import { GraphQLClient } from "graphql-request";

// Sets up a graphql-request client
// Note: this is only used because the Apollo client hooks do not work
// in some places (like react-hook-form validation functions)
// https://www.npmjs.com/package/graphql-request

export function useGraphqlClient(token?: string) {
  return new GraphQLClient(
    KEYS.GRAPHQL_API_ENDPOINT,
    token ? { headers: { authorization: `Bearer ${token}` } } : undefined
  );
}
