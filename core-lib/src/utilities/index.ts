export * from "./audio";

/**
 * Returns an array with values from `start` (inclusive) to `end` (exclusive).
 */
export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start }, (_, i) => i + start);
}
