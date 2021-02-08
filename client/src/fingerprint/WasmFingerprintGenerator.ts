import { FingerprintGenerator } from "./FingerprintGenerator";
import * as Comlink from "comlink";

export class WasmFingerprintGenerator extends FingerprintGenerator {
  constructor() {
    // WebAssembly fingerprint worker
    const wasmFpWorker = new Worker(
      "@/workers/fingerprint/WasmFingerprint.worker.ts",
      { name: "wasm-fingerprint-worker", type: "module" }
    );
    const wasmFpWorkerApi = Comlink.wrap<
      import("@/workers/fingerprint/WasmFingerprint.worker").WasmFingerprintWorker
    >(wasmFpWorker);

    super(wasmFpWorker, wasmFpWorkerApi);
  }
}
