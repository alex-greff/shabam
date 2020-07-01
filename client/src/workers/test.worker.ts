import * as Utilities from "@/utilities";
import { loadWasmModule } from "@/loaders/WASMLoader";

/* eslint-disable no-restricted-globals */
// @ts-ignore
const ctx: Worker = self as any;

ctx.addEventListener('message', (event) => console.log("Test worker:", Utilities.generateId(), event));

ctx.addEventListener("message", (event) => {
    // const { type } = event.data;

    // if (type === "test") {

    // }

    console.log("Here");

    loadWasmModule("main");
});