import { FingerprintWorker } from "./types";
import * as Comlink from "comlink";
import { generateFingerprint } from "@/audio/fingerprint/WasmFingerprintGenerator";

const exports: FingerprintWorker = {
  generateFingerprint,
};

export type WasmFingerprintWorker = typeof exports;
Comlink.expose(exports);
