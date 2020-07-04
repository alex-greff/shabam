// Tell TypeScript how to treat wasm file imports 
declare module "*.wasm" {
    const wasmFile: any;
    export default wasmFile;
}