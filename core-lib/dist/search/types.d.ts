export interface Address {
    anchorFreq: number;
    pointFreq: number;
    delta: number;
}
export interface Couple {
    absTime: number;
    trackId: number;
}
export interface RecordsSearchMatch {
    trackId: number;
    similarity: number;
}
export interface TimeCoherencyDeltaMatch {
    trackId: number;
    timeDelta: number;
}
