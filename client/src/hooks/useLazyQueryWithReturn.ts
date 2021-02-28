// A hack to allow for Apollo lazy queries to return the data
// Adapted from: https://github.com/apollographql/react-apollo/issues/3499#issuecomment-537748212

import { useRef, useEffect, useCallback } from "react";
import * as Apollo from "@apollo/client";

type UseLazyQueryFunc<TData = any, TVariables = any> = (
  baseOptions: Apollo.LazyQueryHookOptions<TData, TVariables>
) => Apollo.QueryTuple<TData, TVariables>;

type LazyQueryHookTuple<TData = any, TVariables = any> = [
  (
    options: Apollo.LazyQueryHookOptions<TData, TVariables>
  ) => Promise<Apollo.LazyQueryResult<TData, TVariables>>,
  Apollo.LazyQueryResult<TData, TVariables>
];

type ResolveRefFunc<TData = any, TVariables = any> = (
  value:
    | Apollo.LazyQueryResult<TData, TVariables>
    | PromiseLike<Apollo.LazyQueryResult<TData, TVariables>>
) => void;

export function useLazyQueryWithReturn<TData = any, TVariables = any>(
  useLazyQuery: UseLazyQueryFunc<TData, TVariables>,
  baseOptions: Apollo.LazyQueryHookOptions<TData, TVariables> = {}
): LazyQueryHookTuple<TData, TVariables> {
  const [execute, result] = useLazyQuery(baseOptions);

  const resolveRef = useRef<ResolveRefFunc<TData, TVariables>>();

  useEffect(() => {
    if (result.called && !result.loading && resolveRef.current) {
      resolveRef.current(result);
      resolveRef.current = undefined;
    }
  }, [result.loading, result.called]);

  const queryLazily = useCallback(
    (options: Apollo.LazyQueryHookOptions<TData, TVariables>) => {
      execute({ ...baseOptions, ...options });
      return new Promise<Apollo.LazyQueryResult<TData, TVariables>>(
        (resolve) => {
          resolveRef.current = resolve;
        }
      );
    },
    [execute]
  );

  return [queryLazily, result];
}
