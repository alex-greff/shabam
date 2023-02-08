import { isNode } from "browser-or-node";
import { assert } from "tsafe";
import { SpectrogramData } from "../spectrogram/types";
import { FingerprintData, FingerprintConfig, PartitionRanges } from "./types";
import { config } from "../configuration";
import CoreLibNative from "../../build/Release/core_lib_native.node";

export function computeFingerprint(
  spectrogramData: SpectrogramData,
  options: Partial<FingerprintConfig> = {}
): [CoreLibNative.Fingerprint, FingerprintData] {
  assert(isNode);

  const defaultOptions: FingerprintConfig = config.fingerprintConfig;
  const optionsNormalized = { ...defaultOptions, ...options };
  const {
    partitionAmount,
    partitionCurve,
    standardDeviationMultiplier,
    slidingWindowHeight,
    slidingWindowWidth,
  } = optionsNormalized;

  const fingerprint = new CoreLibNative.Fingerprint(
    partitionCurve,
    partitionAmount,
    standardDeviationMultiplier,
    slidingWindowWidth,
    slidingWindowHeight,
    spectrogramData.data,
    spectrogramData.numBuckets,
    spectrogramData.numWindows
  );

  fingerprint.compute();
  const fingerprintResult = fingerprint.getFingerprint();

  return [fingerprint, fingerprintResult];
}

export function computePartitionRanges(
  options: Partial<FingerprintConfig> = {},
  spectrogramFFTSize = config.spectrogramConfig.FFTSize
): PartitionRanges {
  const defaultOptions: FingerprintConfig = config.fingerprintConfig;
  const optionsNormalized = { ...defaultOptions, ...options };
  const { partitionAmount, partitionCurve } = optionsNormalized;

  return CoreLibNative.Fingerprint.computePartitionRanges(
    partitionAmount,
    partitionCurve,
    spectrogramFFTSize / 2
  );
}
