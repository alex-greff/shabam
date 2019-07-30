// Takes a wasm module and extracts out its exports
export default async(wasmModule) => {
    const { instance } = await wasmModule();
    return instance.exports;
};