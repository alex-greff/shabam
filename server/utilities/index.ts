import KEYS from "../keys";
import clone from "lodash.clone";
import toPath from "lodash.topath";
import * as db from "../db/main";
import * as FingerprintUtilitiesImport from "./fingerprint";
import * as PromiseUtilitiesImport from "./promise";
import { ResolverFn } from "@kamilkisiela/graphql-tools/dist/stitching/makeRemoteExecutableSchema";

export const FingerprintUtilities = FingerprintUtilitiesImport;
export const PromiseUtilities = PromiseUtilitiesImport;

declare type MiddlewareResolverFn = (rootVal?: any, args?: any, context?: any) => any;

/**
 * Sets up a chain of middlewares. 
 * Returns a function that takes a resolver which is called at the end of the middleware chain.
 * 
 * @param {...Function} middlewares The middlewares to call.
 */
export const middlewareChain = (...middlewares: Function[]) => {
    /**
     * The construction function that takes the end-resolver
     * 
     * @param {*} resolver The resolver that is called.
     */
    return (resolver: MiddlewareResolverFn) => {
        return async (root: any, args: any, context: any) => {
            for (let i = 0; i < middlewares.length; i++) {
                const currMiddleware = middlewares[i];
                await currMiddleware(root, args, context);
            }

            return await resolver(root, args, context);
        };
    };
};

/**
 * Throws the standard authorization error.
 */
export const throwAuthorizationError = () => {
    throw new Error("Authorization failed");
};


// NOTE: isFunction, isObject, isInteger, isString, isNaN, isPromise, getIn and setIn 
// are adapted directly from Fromik's utility module.
// https://github.com/jaredpalmer/formik/blob/master/src/utils.ts

/** @private is the given object a Function? */
export const isFunction = (obj: any) => typeof obj === 'function';

/** @private is the given object an Object? */
export const isObject = (obj: any) => obj !== null && typeof obj === 'object';

/** @private is the given object an integer? */
export const isInteger = (obj: any) => Number.isInteger(obj);

/** @private is the given object a string? */
export const isString = (obj: any) => Object.prototype.toString.call(obj) === '[object String]';

/** @private is the given object a NaN? */
// eslint-disable-next-line no-self-compare
export const isNaN = (obj: any) => obj !== obj;

/** @private is the given object/value a promise? */
export const isPromise = (value: any) => isObject(value) && isFunction(value.then);

/**
 * Deeply get a value from an object via its path.
 */
export const getIn = (obj: any, key: string | string[], def?: any, p: number = 0) => {
    const path = toPath(key);
    while (obj && p < path.length) {
        obj = obj[path[p++]];
    }
    return obj === undefined ? def : obj;
};

/**
 * Deeply set a value from in object via it's path. If the value at `path`
 * has changed, return a shallow copy of obj with `value` set at `path`.
 * If `value` has not changed, return the original `obj`.
 *
 * Existing objects / arrays along `path` are also shallow copied. Sibling
 * objects along path retain the same internal js reference. Since new
 * objects / arrays are only created along `path`, we can test if anything
 * changed in a nested structure by comparing the object's reference in
 * the old and new object, similar to how russian doll cache invalidation
 * works.
 *
 * In earlier versions of this function, which used cloneDeep, there were
 * issues whereby settings a nested value would mutate the parent
 * instead of creating a new object. `clone` avoids that bug making a
 * shallow copy of the objects along the update path
 * so no object is mutated in place.
 *
 * Before changing this function, please read through the following
 * discussions.
 *
 * @see https://github.com/developit/linkstate
 * @see https://github.com/jaredpalmer/formik/pull/123
 */
export const setIn = (obj: any, path: string, value: any): any => {
    let res = clone(obj); // this keeps inheritance when obj is a class
    let resVal = res;
    let i = 0;
    let pathArray = toPath(path);

    for (; i < pathArray.length - 1; i++) {
        const currentPath = pathArray[i];
        let currentObj = getIn(obj, pathArray.slice(0, i + 1));

        if (currentObj) {
            resVal = resVal[currentPath] = clone(currentObj);
        } else {
            const nextPath = pathArray[i + 1];
            resVal = resVal[currentPath] =
                isInteger(nextPath) && Number(nextPath) >= 0 ? [] : {};
        }
    }

    // Return original object if new value is the same as current
    if ((i === 0 ? obj : resVal)[pathArray[i]] === value) {
        return obj;
    }

    if (value === undefined) {
        delete resVal[pathArray[i]];
    } else {
        resVal[pathArray[i]] = value;
    }

    // If the path array has a single element, the loop did not run.
    // Deleting on `resVal` had no effect in this scenario, so we delete on the result instead.
    if (i === 0 && value === undefined) {
        delete res[pathArray[i]];
    }

    return res;
};

/**
 * Checks if the given input is a valid email.
 * 
 * @param {String} email The email.
 */
export const isEmail = (email: String): boolean => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

/**
 * Takes a function and returns a promise that resolves if the function returns a truthy value and rejects if a falsey value.
 * 
 * @param {Function} func Function that returns a truthy or falsey.
 * @param {...Any} params Any parameters to pass in.
 */
export const booleanResolver = (func: Function, ...params: any[]): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        const ret: any = await func(...params);

        if (ret) {
            resolve();
        } else {
            reject();
        }
    });
};

/**
 * Takes a function that returns a promise and returns true if the promise resolves and false if it rejects.
 * 
 * @param {Function} func A function that returns a promise.
 * @param {...Any} params Any parameters to pass in.
 */
export const resolveAsBoolean = async (func: Function, ...params: any[]): Promise<boolean> => {
    try {
        await func(...params);
        return true;
    } catch(err) {
        return false;
    }
};

/**
 * Returns a string parameter list for database queries.
 * 
 * @param {Number} length The length of the parameter list.
 * @param {Number} startParam The starting parameter number.
 * @param {Boolean} i_nQuote Quote the items.
 */
export const dbParamList = (length: number, startParam: number = 1, quote: boolean = false) => {
    const range = [ ...Array(length).fill(0).keys() ];
    const wrapperChar: string = (quote) ? "'" : "";

    return range.map((_, idx) => `${wrapperChar}$${idx + startParam}${wrapperChar}`).join(",");
}