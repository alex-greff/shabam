
import { GraphQLClient } from "graphql-request";
import KEYS from "./keys";


/**
 * Returns given string with a trailing slash, if it does not have it already.
 */
export function trailingSlash(s: string) {
  return (s.endsWith("/") ? s : `${s}/`);
}

export function getGraphqlClient(token?: string): GraphQLClient {
  const client = new GraphQLClient(
    KEYS.GRAPHQL_API_URL,
    token ? { headers: { authorization: `Bearer ${token}` } } : undefined
  );
  return client;
}