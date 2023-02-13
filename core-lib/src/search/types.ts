// TODO: delete all of these
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

export interface SearchConfig {
  /**
   * The size of the target zone.
   */
  targetZoneSize: number;

  /**
   * Dictates how picky the selection cutoff is when comparing the total hit
   * numbers of potential tracks.
   * 0 = every potential track is selected
   * 1 = only clips who have all their target zones match
   * Range: [0, 1]
   */
  searchSelectionCoefficient: number;
}