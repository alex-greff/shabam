import { useGraphqlClient } from "@/hooks/useGraphqlRequestClient";
import { getSdk } from "@/graphql-request.g.d";

// A hook that sets up a graphql-request client and returns the codegen'ed sdk
// See https://graphql-code-generator.com/docs/plugins/typescript-graphql-request
// for how to use it

export function useGraphqlRequestSdk(token?: string) {
  const client = useGraphqlClient(token);
  const sdk = getSdk(client);

  return sdk;
}