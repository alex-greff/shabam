import { FingerprintWorker } from "./types";
import { expose } from "comlink";
import { generateFingerprint } from "@/audio/fingerprint/IterativeFingerprintGenerator";

const exports: FingerprintWorker = {
  generateFingerprint,
};

export type IterativeFingerprintWorker = typeof exports;

expose(exports);
