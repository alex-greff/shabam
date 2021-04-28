import { Injectable } from '@nestjs/common';
import { Fingerprint } from '../fingerprint/fingerprint.types';
import { TARGET_ZONE_SIZE } from './records.config';
import { Address, Couple, Record, RecordsTable } from './records.types';
import * as RecordsDb from '@/db/address/index';

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

  computeRecordsTable(fingerprint: Fingerprint, trackId: number): RecordsTable {
    const recordsTable: RecordsTable = {
      addresses: [],
      trackId,
    };

    // The number of points between the anchor point and the first node of its
    // target zone. This avoids any possibilities of having time deltas of 0
    // since the anchor point is guaranteed to be in a different window than
    // all the points in the target zone
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

  async storeRecordsTable(
    recordsTable: RecordsTable,
    addressDbNum: number,
  ): Promise<void> {
    const dbPool = RecordsDb.getAddressDbPool(addressDbNum);

    // Begin queries
    let addressQuery = `INSERT INTO address (address_enc) VALUES `;
    let couplesQuery = `INSERT INTO couple (couple_enc, address_enc) VALUES `;

    const addressQueryValues: number[] = [];
    const couplesQueryValues: (number | bigint)[] = [];

    let addressQueryIdx = 1;
    let couplesQueryIdx = 1;

    const addressQueryValueText: string[] = [];
    const couplesQueryValueText: string[] = [];

    // Add every address in the records table to the query
    for (const address of recordsTable.addresses) {
      const addressEnc = this.encodeAddress({
        anchorFreq: address.anchorFreq,
        pointFreq: address.pointFreq,
        delta: address.delta,
      });

      addressQueryValueText.push(`($${addressQueryIdx})`);
      addressQueryIdx += 1;
      addressQueryValues.push(addressEnc);

      const coupleEnc = this.encodeCouple({
        absTime: address.absoluteTime,
        trackId: recordsTable.trackId,
      });

      couplesQueryValueText.push(
        `($${couplesQueryIdx}, $${couplesQueryIdx + 1})`,
      );
      couplesQueryIdx += 2;
      couplesQueryValues.push(coupleEnc, addressEnc);
    }

    // Join the value text arrays
    addressQuery += addressQueryValueText.join(', ');
    couplesQuery += couplesQueryValueText.join(', ');

    // End queries
    addressQuery += ' ON CONFLICT DO NOTHING;';
    couplesQuery += ';';

    // console.log('addressQuery', addressQuery); // TODO: remove
    // console.log('couplesQuery', couplesQuery); // TODO: remove

    // Insert the address and couples
    await dbPool.query(addressQuery, addressQueryValues);
    await dbPool.query(couplesQuery, couplesQueryValues);
  }

  private async cleanAddresses(addressDbNum: number) {
    const dbPool = RecordsDb.getAddressDbPool(addressDbNum);

    const addressDeleteQuery = `
      DELETE FROM address AS A 
      WHERE NOT EXISTS (
        SELECT FROM couple AS C
        WHERE C.address_enc = A.address_enc
      );
    `;
    await dbPool.query(addressDeleteQuery);
  }

  async removeRecords(trackId: number, addressDbNum: number): Promise<void> {
    const dbPool = RecordsDb.getAddressDbPool(addressDbNum);

    // Delete all couples relating to this track id
    const couplesDeleteQuery = `
      DELETE FROM couple AS C
      WHERE (C.couple_enc & 4294967295) = $1;
    `;
    await dbPool.query(couplesDeleteQuery, [trackId]);

    // Delete any straggling addresses that do not reference any other tracks
    // (this is just to keep the database clean and minimize bloat)
    await this.cleanAddresses(addressDbNum);
  }
}
