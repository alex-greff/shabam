import { Fingerprint } from '../fingerprint/fingerprint.types';
import { TARGET_ZONE_SIZE } from './records.config';

export interface Address {
  anchorFreq: number;
  pointFreq: number;
  delta: number;
}

export interface Couple {
  absTime: number;
  trackId: number;
}

export interface Record {
  anchorFreq: number;
  pointFreq: number;
  delta: number;
  absoluteTime: number;
}

export class RecordsTable implements Iterable<Record> {
  constructor(private fingerprint: Fingerprint, public trackId: number) {}

  *[Symbol.iterator](): Iterator<Record> {
    // The number of points between the anchor point and the first node of its
    // target zone. This avoids any possibilities of having time deltas of 0
    // since the anchor point is guaranteed to be in a different window than
    // all the points in the target zone
    const ANCHOR_POINT_GAP = this.fingerprint.numberOfPartitions - 1;

    // Treat this point as the anchor point and compute its
    // corresponding address records
    for (const anchorCell of this.fingerprint) {
      // Generate addresses records for all target zones
      for (let zone = 0; zone < TARGET_ZONE_SIZE; zone++) {
        const pointCell = this.fingerprint.getCell(
          anchorCell.cellNum + ANCHOR_POINT_GAP + zone,
        );

        // We reached the end of the fingerprint, so stop trying to
        // create address records
        if (!pointCell) break;

        // Create a record and add yield it
        const record: Record = {
          anchorFreq: anchorCell.partition,
          pointFreq: pointCell.partition,
          delta: pointCell.window - anchorCell.window,
          absoluteTime: anchorCell.window,
        };

        yield record;
      }
    }
  }
}
