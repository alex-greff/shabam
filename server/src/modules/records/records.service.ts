import { Injectable } from '@nestjs/common';
import { Fingerprint } from '../fingerprint/fingerprint.types';
import { TARGET_ZONE_SIZE } from './records.config';
import { Address, Couple, Record, RecordsTable } from './records.types';

@Injectable()
export class RecordsService {
  private computeRecordsTable(
    fingerprint: Fingerprint,
    trackId: number,
  ): RecordsTable {
    const recordsTable: RecordsTable = {
      addresses: [],
      trackId,
    };

    const ANCHOR_POINT_GAP = fingerprint.numberOfPartitions - 1;

    // Treat this point as the anchor point and compute its
    // corresponding address records
    for (const anchorCell of fingerprint) {
      // Generate addresses records for all target zones
      for (let zone = 0; zone < TARGET_ZONE_SIZE; zone++) {
        const pointCell = fingerprint.getCell(
          anchorCell.cellNum + ANCHOR_POINT_GAP + zone,
        );

        // We reached the end of the fingerprint, so stop trying to
        // create address records
        if (!pointCell) break;

        // Create a record and add it to the records table
        const record: Record = {
          anchorFreq: anchorCell.partition,
          pointFreq: pointCell.partition,
          delta: pointCell.window - anchorCell.window,
          absoluteTime: anchorCell.window,
        };

        recordsTable.addresses.push(record);
      }
    }

    return recordsTable;
  }

  async storeFingerprint(
    fingerprint: Fingerprint,
    trackId: number,
    addressDb: number | null = null,
  ): Promise<void> {
    const recordsTable = this.computeRecordsTable(fingerprint, trackId);

    if (!addressDb) {
      // TODO: select a address db to insert into
      addressDb = 0;
    }

    console.log("recordsTable", recordsTable);

    // TODO: save to the database
  }

  private encodeAddress({ anchorFreq, pointFreq, delta }: Address): number {
    // Check that we can actually encode it in a 32-bit integer
    const PARTITION_MAX = 512; // 2^9
    const DELTA_MAX = 16384; // 2^14
    if (
      anchorFreq > PARTITION_MAX ||
      pointFreq > PARTITION_MAX ||
      delta > DELTA_MAX
    )
      throw 'An input value is too big';

    // Bit layout:
    // |                        32-bit integer                         |
    // |x x x x x x x x x|x x x x x x x x x|x x x x x x x x x x x x x x|
    // |   anchor freq   |    point freq   |           delta           |

    let encoded = anchorFreq; // add anchorFreq
    encoded = encoded << 9; // make space for pointFreq
    encoded = encoded | pointFreq; // add pointFreq
    encoded = encoded << 14; // make space for delta
    encoded = encoded | delta; // add delta

    return encoded;
  }

  private decodeAddress(address: number): Address {
    // Bit layout:
    // |                        32-bit integer                         |
    // |x x x x x x x x x|x x x x x x x x x|x x x x x x x x x x x x x x|
    // |   anchor freq   |    point freq   |           delta           |

    // 11111111100000000000000000000000
    const ANCHOR_MASK = 511 << 23;

    // 00000000011111111100000000000000
    const POINT_MASK = 511 << 14;

    // 00000000000000000011111111111111
    const DELTA_MASK = 16383;

    const anchorFreq = (address & ANCHOR_MASK) >> 23;
    const pointFreq = (address & POINT_MASK) >> 14;
    const delta = address & DELTA_MASK;

    return {
      anchorFreq,
      pointFreq,
      delta,
    };
  }

  private encodeCouple({ absTime, trackId }: Couple): bigint {
    // Bit layout
    // |                          64-bit integer                         |
    // |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
    // |            absTime             |             trackId            |

    let encoded = BigInt(absTime); // add absTime
    encoded = encoded << BigInt(32); // make space for trackId
    encoded = encoded | BigInt(trackId); // add trackId

    return encoded;
  }

  private decodeCouple(couple: bigint): Couple {
    // Bit layout
    // |                          64-bit integer                         |
    // |xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx|
    // |            absTime             |             trackId            |

    // 1111111111111111111111111111111100000000000000000000000000000000
    const ABS_TIME_MASK = BigInt(4294967295) << BigInt(32);

    // 11111111111111111111111111111111
    const TRACK_ID_MASK = BigInt(4294967295);

    const absTime = Number((couple & ABS_TIME_MASK) >> BigInt(32));
    const trackId = Number(couple & TRACK_ID_MASK);

    return {
      absTime,
      trackId,
    };
  }
}
