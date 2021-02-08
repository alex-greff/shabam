import { FingerprintGenerator } from "./FingerprintGenerator";
import * as Comlink from "comlink";

export class IterativeFingerprintGenerator extends FingerprintGenerator {
  constructor() {
    // Iterative fingerprint worker
    const iterFpWorker = new Worker(
      "@/workers/fingerprint/IterativeFingerprint.worker.ts",
      { name: "iterative-fingerprint-worker", type: "module" }
    );
    const iterFpWorkerApi = Comlink.wrap<
      import("@/workers/fingerprint/IterativeFingerprint.worker").IterativeFingerprintWorker
    >(iterFpWorker);

    super(iterFpWorker, iterFpWorkerApi);
  }
}
