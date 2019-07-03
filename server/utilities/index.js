const KEYS = require("../keys");
const clone = require("lodash.clone");
const toPath = require("lodash.topath");

/**
 * Sets up a chain of middlewares. 
 * Returns a function that takes a resolver which is called at the end of the middleware chain.
 * 
 * @param  {...Function} middlewares The middlewares to call.
 */
exports.middlewareChain = (...middlewares) => {
    /**
     * The construction function that takes the end-resolver
     * 
     * @param {*} resolver The resolver that is called.
     */
    return (resolver) => {
        return async (root, args, context) => {
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
exports.throwAuthorizationError = () => {
    throw new Error("Authorization failed");
};


// NOTE: isFunction, isObject, isInteger, isString, isNaN, isPromise, getIn and setIn 
// are adapted directly from Fromik's utility module.
// https://github.com/jaredpalmer/formik/blob/master/src/utils.ts

/** @private is the given object a Function? */
exports.isFunction = (obj) => typeof obj === 'function';

/** @private is the given object an Object? */
exports.isObject = (obj) => obj !== null && typeof obj === 'object';

/** @private is the given object an integer? */
exports.isInteger = (obj) => String(Math.floor(Number(obj))) === obj;

/** @private is the given object a string? */
exports.isString = (obj) => Object.prototype.toString.call(obj) === '[object String]';

/** @private is the given object a NaN? */
// eslint-disable-next-line no-self-compare
exports.isNaN = (obj) => obj !== obj;

/** @private is the given object/value a promise? */
exports.isPromise = (value) => isObject(value) && isFunction(value.then);

/**
 * Deeply get a value from an object via its path.
 */
exports.getIn = (obj, key, def, p = 0) => {
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
exports.setIn = (obj, path, value) => {
    let res = clone(obj); // this keeps inheritance when obj is a class
    let resVal = res;
    let i = 0;
    let pathArray = toPath(path);

    for (; i < pathArray.length - 1; i++) {
        const currentPath = pathArray[i];
        let currentObj = exports.getIn(obj, pathArray.slice(0, i + 1));

        if (currentObj) {
            resVal = resVal[currentPath] = clone(currentObj);
        } else {
            const nextPath = pathArray[i + 1];
            resVal = resVal[currentPath] =
                exports.isInteger(nextPath) && Number(nextPath) >= 0 ? [] : {};
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

exports.isEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};