export * from "./fingerprint/types";
export { config } from "./configuration";
export { getWavFileDuration } from "./utilities/audio";

export { generateFingerprint as functionalGenerateFingerprint } from "./fingerprint/generators/functional.fingerprint-generator";
export { generateFingerprint as iterativeGenerateFingerprint } from "./fingerprint/generators/iterative.fingerprint-generator";
// TODO: eventually port over the WASM fingerprint generator as well
