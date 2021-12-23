export * from "./types";
export { generateFingerprint as functionalGenerateFingerprint } from "./generators/functional.fingerprint-generator";
export { generateFingerprint as iterativeGenerateFingerprint } from "./generators/iterative.fingerprint-generator";

// TODO: eventually port over the WASM fingerprint generator as well