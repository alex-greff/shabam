import { FingerprintClass } from "./fingerprint-class";
export interface Record {
    anchorFreq: number;
    pointFreq: number;
    delta: number;
    anchorAbsoluteTime: number;
}
export declare class RecordsTable implements Iterable<Record> {
    private fingerprint;
    constructor(fingerprint: FingerprintClass);
    [Symbol.iterator](): Iterator<Record>;
    getNumTargetZones(): number;
}
export declare class TrackRecordsTable extends RecordsTable {
    trackId: number;
    constructor(fingerprint: FingerprintClass, trackId: number);
}
