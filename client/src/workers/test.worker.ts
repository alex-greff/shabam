// TODO: remove module
// import * as Utilities from "@/utilities";
// import { loadWasmModule } from "@/loaders/WASMLoader";
import { expose } from "comlink";

const exports = {
  test() {
    console.log("Test");
  },
};

export type TestWorker = typeof exports;

expose(exports);

/* eslint-disable no-restricted-globals */
// const ctx: Worker = self as any;

// ctx.addEventListener('message', (event) => console.log("Test worker:", Utilities.generateId(), event));

// ctx.addEventListener("message", (event) => {
//     // const { type } = event.data;

//     // if (type === "test") {

//     // }

//     console.log("Here");

//     loadWasmModule("main");
// });
