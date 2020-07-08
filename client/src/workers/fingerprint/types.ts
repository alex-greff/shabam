import { FingerprintGeneratorFunction } from "@/audio/types";

export interface FingerprintWorker {
    generateFingerprint: FingerprintGeneratorFunction;
}