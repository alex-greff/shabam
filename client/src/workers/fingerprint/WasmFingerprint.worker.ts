import { FingerprintWorker } from "./types";
import { expose } from "comlink";
import { generateFingerprint } from "@/audio/fingerprint/WasmFingerprintGenerator";

const exports: FingerprintWorker = {
  generateFingerprint,
};

export type WasmFingerprintWorker = typeof exports;
expose(exports);
