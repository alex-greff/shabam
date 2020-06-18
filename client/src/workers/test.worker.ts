import * as Utilities from "@/utilities";

/* eslint-disable no-restricted-globals */
// @ts-ignore
const ctx: Worker = self as any;

ctx.addEventListener('message', (event) => console.log("Test worker:", Utilities.generateId(), event));