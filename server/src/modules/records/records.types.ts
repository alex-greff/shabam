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
      // Generate addresses records for all target zones
      for (let zone = 0; zone < TARGET_ZONE_SIZE; zone++) {
        const pointCell = this.fingerprint.getCell(
          anchorCell.cellNum + ANCHOR_POINT_OFFSET + zone,
        );

        // We reached the end of the fingerprint, so stop trying to
        // create address records
        if (!pointCell) break;

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

  getNumRecords() {
    // Due to the massive size these records tables can be, it is not
    // practical to naively compute the entire table and just .length the array.
    // As such, we want to arithmetically compute how many records the current
    // fingerprint would produce if you were to iterate through the entire thing

    // To derive the formula by inspection let's look at a simple example:
    // TARGET_ZONE_SIZE = 5, ANCHOR_POINT_OFFSET = 3, fingerprintLength = 10
    // Laying out the fingerprint points sequentially we see the
    // following properties emerges for the anchor points:
    //
    //  fp point: |  x0   x1   x2   x3   x4   x5   x6   x7   x8   x9 |
    // generates: |       5       | 4  | 3  | 2  | 1  |      0       |
    //
    // We see that x0, x1, x3 each are able to generate records for their full
    // target zones, let's call them "full points". x4, x5, x6 sequentially
    // generate one less record each as their target zones begin to run out of
    // fingerprint points, I'll call them "partial points". Finally, x7, x8, x9
    // are unable to form any target zones so they generate no records,
    // essentially making them "dead points".
    //
    // So the trick that we want to do is figure out how many partial and dead
    // points exist and from there we can easily derive how many full points
    // exist and from there calculate how many records are generated in total.
    //
    // By inspection (and some confirmation) we get:
    //   numDeadPoints = ANCHOR_POINT_OFFSET
    //   numPartialPoints = TARGET_ZONE_SIZE - 1
    //   numFullPoints = fingerprintLength - numDeadPoints - numPartialPoints
    //
    // Now we are able easily calculate how many records the partial and full
    // points produce
    //   numRecordsPartialPoints
    //     = sum(1 to (TARGET_ZONE_SIZE - 1))
    //     = 1/2 * ((TARGET_ZONE_SIZE - 1)^2 + (TARGET_ZONE_SIZE - 1))
    //       ^^^ We used the arithmetic sum series from 1 to k formula here
    //   numRecordsFullPoints = TARGET_ZONE_SIZE * numFullPoints
    //
    // Therefore we finally get:
    //   numRecords = numRecordsPartialPoints + numRecordsFullPoints

    // Here's the implementation (simplified for efficiency):

    const numRecordsPartialPoints =
      (1 / 2) * (Math.pow(TARGET_ZONE_SIZE - 1, 2) + (TARGET_ZONE_SIZE - 1));
    const numRecordsFullPoints =
      TARGET_ZONE_SIZE *
      (this.fingerprint.numberOfPartitions - TARGET_ZONE_SIZE - 1);

    return numRecordsPartialPoints + numRecordsFullPoints;
  }
}

export class RecordsTable extends RecordsBaseTable {
  constructor(fingerprint: Fingerprint, public trackId: number) {
    super(fingerprint);
  }
}

export class RecordsClipTable extends RecordsBaseTable {}
