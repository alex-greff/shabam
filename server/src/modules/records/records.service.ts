import { Injectable } from '@nestjs/common';
import { Address, Couple, RecordsTable } from './records.types';
import * as RecordsDb from '@/db/address/index';
import { Pool } from 'pg';

// How many addresses/couples to put into a query before running it
const UPLOAD_EVERY_NTH_ITEMS = 5000;

@Injectable()
export class RecordsService {
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

  private async flushChunk(
    dbPool: Pool,
    couplesQueryValueText: string[],
    couplesQueryValues: (number | bigint)[],
  ) {
    const couplesQuery = `
      INSERT INTO couple (couple_enc, address_enc)
      VALUES ${couplesQueryValueText.join(', ')};
    `;

    // Insert the couples into the address database
    await dbPool.query(couplesQuery, couplesQueryValues);
  }

  async storeRecordsTable(
    recordsTable: RecordsTable,
    addressDbNum: number,
  ): Promise<void> {
    const dbPool = RecordsDb.getAddressDbPool(addressDbNum);

    let couplesQueryIdx = 1;
    let couplesQueryValueText: string[] = [];
    let couplesQueryValues: (number | bigint)[] = [];

    let i = 0;
    for (const record of recordsTable) {
      // New chunk, upload accumulated data and reset accumulators
      if (i % UPLOAD_EVERY_NTH_ITEMS === 0) {
        // Only upload if there is a chunk
        if (i !== 0) {
          await this.flushChunk(
            dbPool,
            couplesQueryValueText,
            couplesQueryValues,
          );

          // Reset accumulators
          couplesQueryIdx = 1;
          couplesQueryValueText = [];
          couplesQueryValues = [];
        }
      }

      // Add this record to the accumulator
      const addressEnc = this.encodeAddress({
        anchorFreq: record.anchorFreq,
        pointFreq: record.pointFreq,
        delta: record.delta,
      });

      const coupleEnc = this.encodeCouple({
        absTime: record.absoluteTime,
        trackId: recordsTable.trackId,
      });

      couplesQueryValueText.push(
        `($${couplesQueryIdx}, $${couplesQueryIdx + 1})`,
      );
      couplesQueryIdx += 2;
      couplesQueryValues.push(coupleEnc, addressEnc);

      i++;
    }

    // Flush any remainder chunks at the end
    if (couplesQueryValues.length > 0) {
      await this.flushChunk(
        dbPool,
        couplesQueryValueText,
        couplesQueryValues,
      );
    }
  }

  async removeRecords(trackId: number, addressDbNum: number): Promise<void> {
    const dbPool = RecordsDb.getAddressDbPool(addressDbNum);

    // Delete all couples relating to this track id
    const couplesDeleteQuery = `
      DELETE FROM couple AS C
      WHERE (C.couple_enc & 4294967295) = $1;
    `;
    await dbPool.query(couplesDeleteQuery, [trackId]);
  }
}
