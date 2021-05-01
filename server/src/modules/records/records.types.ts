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
  anchorAbsoluteTime: number;
}

export interface RecordsSearchMatch {
  trackId: number;
  similarity: number;
}

class RecordsBaseTable implements Iterable<Record> {
  constructor(private fingerprint: Fingerprint) {}

  *[Symbol.iterator](): Iterator<Record> {
    // The number of points between the anchor point and the first node of its
    // target zone. This avoids any possibilities of having time deltas of 0
    // since the anchor point is guaranteed to be in a different window than
    // all the points in the target zone
    const ANCHOR_POINT_OFFSET = this.fingerprint.numberOfPartitions;

    // Treat this point as the anchor point and compute its
    // corresponding address records
    for (const anchorCell of this.fingerprint) {
      // Stop generating records if the anchor cell cannot fit a full target
      // zone. Note: this assumes that the order of the cells in the fingerprint
      // is ordered (actually everything assumes this).
      const canFitFullTargetZone = this.fingerprint.hasCell(
        anchorCell.cellNum + ANCHOR_POINT_OFFSET + TARGET_ZONE_SIZE - 1,
      );
      if (!canFitFullTargetZone) break;

      // Generate addresses records for all target zones
      for (let zone = 0; zone < TARGET_ZONE_SIZE; zone++) {
        const pointCell = this.fingerprint.getCell(
          anchorCell.cellNum + ANCHOR_POINT_OFFSET + zone,
        );

        if (!pointCell) throw 'Should not be reached';

        // Create a record and add yield it
        const record: Record = {
          anchorFreq: anchorCell.partition,
          pointFreq: pointCell.partition,
          delta: pointCell.window - anchorCell.window,
          anchorAbsoluteTime: anchorCell.window,
        };

        yield record;
      }
    }
  }

  getNumTargetZones() {
    // Due to the massive size these records tables can be, it is not
    // practical to naively compute the entire table and just .length the array
    // in order to find how many target zones exist in the current record table.

    // To derive the formula by inspection let's look at a simple example:
    // TARGET_ZONE_SIZE = 5, ANCHOR_POINT_OFFSET = 3, fingerprintLength = 10
    // Laying out the fingerprint points sequentially we see the
    // following properties emerges for the anchor points:
    //
    // fp point: |  x0   x1   x2   x3   x4   x5   x6   x7   x8   x9 |
    //  TZ size: |       5       | 4  | 3  | 2  | 1  |      0       |
    //
    // We see that x0, x1, x2 each are able to create target zones of size 5 and
    // as a result will produce records. x3, x4, x5, x6 sequentially
    // can support smaller target zones, which means that since they cannot form
    // full target zones, they will be skipped and no records will be produced.
    // Finally x6, x7, x8, x9 cannot form any target zones so like x4, x5 and
    // x6, no records will be produced. Let's call x0, x1, x2 "full points",
    // x3, x4, x5, x6 "partial points" and x7, x8, x9 "dead points".
    //
    // So the trick that we want to do is figure out how many partial and dead
    // points exist and from there we can easily derive how many full points
    // exist and from there calculate how many target zones are generated in
    // total.
    //
    // By inspection (and some confirmation) we get:
    //   numDeadPoints = ANCHOR_POINT_OFFSET
    //   numPartialPoints = TARGET_ZONE_SIZE - 1
    //   numFullPoints = fingerprintLength - numDeadPoints - numPartialPoints
    //
    // So we know that the number of target zones produced will just be the
    // number of full points
    //   numTargetZones = numFullPoints

    // Here's the implementation (simplified for efficiency):
    return (
      TARGET_ZONE_SIZE *
      (this.fingerprint.numberOfPartitions - TARGET_ZONE_SIZE - 1)
    );
  }
}

export class RecordsTable extends RecordsBaseTable {
  constructor(fingerprint: Fingerprint, public trackId: number) {
    super(fingerprint);
  }
}

export class RecordsClipTable extends RecordsBaseTable {}
