import { Interfaces } from "@oclif/core";


// Workaround for no strong typing for args.
// Source: https://github.com/oclif/oclif/issues/404#issuecomment-686173464
export type GetF<T> = T extends Interfaces.Input<infer F> ? F : never;