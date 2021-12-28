import { ClientError, GraphQLClient } from "graphql-request";
import { getSdk, Sdk } from "../graphql-request.g";
import KEYS from "../keys";
import color from "@oclif/color";

/**
 * Returns given string with a trailing slash, if it does not have it already.
 */
export function trailingSlash(s: string) {
  return s.endsWith("/") ? s : `${s}/`;
}

export function getGraphqlClient(token?: string): GraphQLClient {
  const client = new GraphQLClient(
    KEYS.GRAPHQL_API_URL,
    token ? { headers: { authorization: `Bearer ${token}` } } : undefined
  );
  return client;
}

export function getGraphqlClientSdk(token?: string): Sdk {
  const client = getGraphqlClient(token);
  const sdk = getSdk(client);

  return sdk;
}

export function prettyPrintErrors(
  clientErr: ClientError,
  prefixText?: string
): string {
  let errStr = `${(prefixText ?? "An error occurred")}`;
  const errors = clientErr.response.errors ?? [];
  for (let error of errors) {
    const carrotPrefix = color.blueBright(">");
    const errorCode = error.extensions?.exception?.status as number | undefined;
    const errorCodePrefix = (errorCode) ? `[${color.red(errorCode)}] ` : "";
    const errorCodeMessage = error.message;
    errStr += `\n${carrotPrefix} ${errorCodePrefix}${errorCodeMessage}`;
  }
  return errStr;
}
