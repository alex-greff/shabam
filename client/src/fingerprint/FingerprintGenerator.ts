import {
  Fingerprint,
  FingerprintGeneratorFunction,
  FingerprintGeneratorOptions,
  SpectrogramData,
} from "@/audio/types";
import * as Comlink from "comlink";

interface WorkerAPI {
  generateFingerprint: FingerprintGeneratorFunction;
}

export abstract class FingerprintGenerator {
  constructor(
    protected worker: Worker,
    protected workerApi: Comlink.Remote<WorkerAPI>
  ) {}

  async generateFingerprint(
    spectrogramData: SpectrogramData,
    options: Partial<FingerprintGeneratorOptions> = {}
  ): Promise<Fingerprint | null> {
    try {
      const fingerprint = await this.workerApi.generateFingerprint(
        spectrogramData,
        options
      );
      return fingerprint;
    } catch (err) {}

    return null;
  }
}
