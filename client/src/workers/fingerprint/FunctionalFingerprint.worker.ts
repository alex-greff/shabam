import { FingerprintWorker } from "./types";
import { expose } from "comlink";
import { generateFingerprint } from "@/audio/fingerprint/FunctionalFingerprintGenerator";

const exports: FingerprintWorker = {
  generateFingerprint,
};

export type FunctionalFingerprintWorker = typeof exports;

expose(exports);
