import { FingerprintGenerator } from "./FingerprintGenerator";
import * as Comlink from "comlink";

export class FunctionalFingerprintGenerator extends FingerprintGenerator {
  constructor() {
    // Functional fingerprint worker
    const funcFpWorker = new Worker(
      "@/workers/fingerprint/FunctionalFingerprint.worker.ts",
      { name: "functional-fingerprint-worker", type: "module" }
    );
    const funcFpWorkerApi = Comlink.wrap<
      import("@/workers/fingerprint/FunctionalFingerprint.worker").FunctionalFingerprintWorker
    >(funcFpWorker);

    super(funcFpWorker, funcFpWorkerApi);
  }
}
