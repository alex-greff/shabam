import { FingerprintWorker } from "./types";
import * as Comlink from "comlink";
import { generateFingerprint } from "@/audio/fingerprint/IterativeFingerprintGenerator";

const exports: FingerprintWorker = {
  generateFingerprint,
};

export type IterativeFingerprintWorker = typeof exports;

Comlink.expose(exports);
