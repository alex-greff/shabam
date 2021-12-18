import { Interfaces } from "@oclif/core";

// Workaround for no strong typing for args.
// Source: https://github.com/oclif/oclif/issues/404#issuecomment-686173464
export type GetF<T> = T extends Interfaces.Input<infer F> ? F : never;


/**
 * Returns given string with a trailing slash, if it does not have it already.
 */
export function trailingSlash(s: string) {
  return (s.endsWith("/") ? s : `${s}/`);
}