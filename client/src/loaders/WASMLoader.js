// Used for extracting and loading WASM modules
// NOTE: if the WASM module is not component-specific,
// it is recommended to inject it globally with VueWasm in main.js
export default async(wasmModule) => {
    const { instance } = await wasmModule();
    return instance.exports;
};