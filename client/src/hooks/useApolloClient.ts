import {
  ApolloClient,
  ApolloLink,
  concat,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { useMemo } from "react";
import KEYS from "@/keys";
import { TOKEN_STORAGE_KEY } from "@/constants";
import { UserTokenStorage } from "@/store/account/account.store";

export function useApolloClient() {
  const client = useMemo(() => {
    const httpLink = new HttpLink({ uri: KEYS.GRAPHQL_API_ENDPOINT });

    const authMiddleware = new ApolloLink((operation, forward) => {
      // Add authorization to headers
      const tokenDataStr = localStorage.getItem(TOKEN_STORAGE_KEY);
      const tokenData = tokenDataStr
        ? (JSON.parse(tokenDataStr) as UserTokenStorage)
        : null;
      operation.setContext({
        headers: {
          authorization: `Bearer ${tokenData?.token}` || null,
        },
      });

      return forward(operation);
    });

    return new ApolloClient({
      cache: new InMemoryCache(),
      link: concat(authMiddleware, httpLink),
    });
  }, []);

  return client;
}
