import { Fingerprint } from "../fingerprint/types";
export interface FingerprintCell {
    partition: number;
    window: number;
    cellNum: number;
}
/**
 * Class representation of a fingerprint which provides methods useful for
 * the search process.
 */
export declare class FingerprintClass implements Iterable<FingerprintCell> {
    readonly numberOfWindows: number;
    readonly numberOfPartitions: number;
    private data;
    constructor(numberOfWindows: number, numberOfPartitions: number, data: Uint32Array);
    static fromFingerprintInterface(fingerprint: Fingerprint): FingerprintClass;
    [Symbol.iterator](): Iterator<FingerprintCell>;
    getCell(index: number): FingerprintCell | null;
    hasCell(index: number): boolean;
}
