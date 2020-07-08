import { FingerprintGeneratorFunction } from "@/audio/types";
import { WasmModuleWrapper } from "@/loaders/WASMLoader";

const wasmModule = new WasmModuleWrapper(import("@WASM/fingerprint.js"), import("@WASM/fingerprint.wasm"));
wasmModule.initialize();

export const generateFingerprint: FingerprintGeneratorFunction = async (spectrogramData, options) => {
    try {
        await wasmModule.loaderPromise;

        console.log(wasmModule.module);

    } catch(err) {
        console.log("Failed to load fingerprint generator wasm module");
    }

    // TODO: remove temp return 
    return {
        numberOfWindows: 0,
        numberOfPartitions: 0,
        data: new Uint8Array(0),
        partitionRanges: []
    }
}