import { FingerprintWorker } from "./types";
import * as Comlink from "comlink";
import { generateFingerprint } from "@/audio/fingerprint/FunctionalFingerprintGenerator";

const exports: FingerprintWorker = {
  generateFingerprint,
};

export type FunctionalFingerprintWorker = typeof exports;

Comlink.expose(exports);
