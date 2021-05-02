import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  Address,
  Couple,
  ClipRecordsTable,
  RecordsSearchMatch,
  RecordsTable,
  TimeCoherencyDeltaMatch,
} from './records.types';
import * as RecordsDb from '@/db/address/index';
import { Pool } from 'pg';
import {
  SEARCH_EVERY_N_COUPLES,
  SEARCH_SELECTION_COEFFICIENT,
  TARGET_ZONE_SIZE,
  UPLOAD_EVERY_NTH_ITEMS,
} from './records.config';
import { CatalogService } from '../catalog/catalog.service';

@Injectable()
export class RecordsService {
  constructor(
    @Inject(forwardRef(() => CatalogService))
    private readonly catalogService: CatalogService,
  ) {}

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
    // = 511 << 23
    // = -8388608
    const ANCHOR_MASK = -8388608;

    // 00000000011111111100000000000000
    // = 511 << 14
    // = 8372224
    const POINT_MASK = 8372224;

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
    // 4294967295n << 32n
    // 18446744069414584320n
    const ABS_TIME_MASK = BigInt("18446744069414584320");

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
        absTime: record.anchorAbsoluteTime,
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
      await this.flushChunk(dbPool, couplesQueryValueText, couplesQueryValues);
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

  async searchRecords(
    clipRecordsTable: ClipRecordsTable,
    maxResults = 1,
  ): Promise<RecordsSearchMatch[]> {
    // ------------------------------
    // --- Hits Compilation Phase ---
    // ------------------------------

    // A map that counts the number of times a couple appears in the clip table
    const coupleToHits = new Map<bigint, number>();

    // For each record in the clip table, perform a search for its address
    // in each records database and accumulate its results in
    // the coupleToHits map
    for (const clipRecord of clipRecordsTable) {
      const address_enc = this.encodeAddress({
        anchorFreq: clipRecord.anchorFreq,
        pointFreq: clipRecord.pointFreq,
        delta: clipRecord.delta,
      });

      // TODO: do this for all records databases
      // For each address database, search the current address and accumulate
      // the hits to coupleToHits
      const numDbs = 0; // TODO: get this from KEYS or something
      const dbJobs = Array(numDbs)
        .fill(0)
        .map(async (_, addressDbNum) => {
          const dbPool = RecordsDb.getAddressDbPool(addressDbNum);

          // Determine how many matches exist
          const matchNumQuery = `
            SELECT COUNT(C.couple_enc) FROM couple AS C 
            WHERE C.address_enc = $1;
          `;
          const matchNumRes = await dbPool.query(matchNumQuery, [address_enc]);
          const numMatches = parseInt(matchNumRes.rows[0].count);

          // Query the matches in chunks and accumulate the
          // results in coupleToHits
          let accumulatedMatches = 0;
          while (accumulatedMatches < numMatches) {
            const matchQuery = `
              SELECT C.couple_enc FROM couple AS C
              WHERE C.address_enc = $1
              ORDER BY C.couple_enc
              LIMIT $2 OFFSET $3;
            `;

            const matchRes = await dbPool.query(matchQuery, [
              address_enc,
              SEARCH_EVERY_N_COUPLES,
              accumulatedMatches,
            ]);

            for (const row of matchRes.rows) {
              const couple_enc = BigInt(row.couple_enc as string);

              // Update the appearance count map
              const currHits = coupleToHits.get(couple_enc) ?? 0;
              coupleToHits.set(couple_enc, currHits + 1);
            }

            accumulatedMatches += matchRes.rowCount;
          }
        });

      // Wait for all the database accumulation jobs to complete before going
      // on to the next record
      // Note: I don't think it is a good idea to perform this await after
      // the records loop because you are going to end up with an insanely long
      // array of promises to await on which I imagine is going to incur a
      // significant performance overhead after a certain size
      await Promise.all(dbJobs);
    }

    // -----------------------
    // --- Filtering Phase ---
    // -----------------------

    // Now that we have the appearance count map we can start filtering tracks

    // Tracks tracks to the total number of hits that they had
    // in the coupleToHits map
    // Note: TZ = target zone
    const trackIdToTotalTZHits = new Map<number, number>();

    // Populate trackIdToTotalHits from coupleToHits and filter out any couples
    // who do not form a target zone
    for (const [couple_enc, num_hits] of coupleToHits) {
      // Ignore couples that appear less than TARGET_ZONE_SIZE times
      // (i.e. a full target zone was not matched for this anchor)
      // (i.e. all points that don't form a target zone)
      // TODO: the article used 4 but I used 5 here, I should double check
      // again to see if this is right and he made a typo
      if (num_hits < TARGET_ZONE_SIZE) continue;

      const { trackId } = this.decodeCouple(couple_enc);

      const currTotalTZHits = trackIdToTotalTZHits.get(trackId) ?? 0;
      trackIdToTotalTZHits.set(trackId, currTotalTZHits + 1);
    }

    const numTZClipTable = clipRecordsTable.getNumTargetZones();

    // Filter out all tracks that do not pass the cutoff
    for (const [trackId, totalNumTZHits] of trackIdToTotalTZHits) {
      if (totalNumTZHits < SEARCH_SELECTION_COEFFICIENT * numTZClipTable)
        trackIdToTotalTZHits.delete(trackId);
    }

    // ----------------------------
    // --- Time Coherency Phase ---
    // ----------------------------

    // A list of jobs that resolve the time delta with the largest time
    // coherency for each potential track
    const timeCoherencyJobs: (() => Promise<TimeCoherencyDeltaMatch>)[] = [];

    // Go through each of the remaining potential tracks
    for (const trackId of trackIdToTotalTZHits.keys()) {
      timeCoherencyJobs.push(async () => {
        // Figure out what address db the track belongs to
        const track = await this.catalogService.getTrack(trackId);
        if (!track)
          throw `Time coherency: unable to find track '${trackId}'.`;

        const addressDbNum = track.addressDatabase;
        const dbPool = RecordsDb.getAddressDbPool(addressDbNum);

        // list of [time delta, abs clip anchor time]
        const timeDeltas: [number, number][] = [];

        // For each record in the clip, find the record(s) for the current track
        // in the address db with the same addresses
        for (const clipRecord of clipRecordsTable) {
          const recordQuery = `
            SELECT C.couple_enc FROM couple AS C
            WHERE (C.couple_enc & 4294967295) = $1 AND C.address_enc = $2;
          `;

          const address_enc_clip = this.encodeAddress({
            anchorFreq: clipRecord.anchorFreq,
            pointFreq: clipRecord.pointFreq,
            delta: clipRecord.delta,
          });

          const recordQueryRes = await dbPool.query(recordQuery, [
            trackId,
            address_enc_clip,
          ]);

          if (recordQueryRes.rowCount === 0) throw "Time coherency: there must be at least one matching record query row.";

          // For every track record that matches the clip record's address,
          // we calculate its delta where
          // delta = "abs time of record anchor - abs time of track record"
          for (const row of recordQueryRes.rows) {
            const couple_enc_str = row.couple_enc;
            const couple_enc = BigInt(couple_enc_str);

            const { absTime } = this.decodeCouple(couple_enc);

            const timeDelta = clipRecord.anchorAbsoluteTime - absTime;
            timeDeltas.push([timeDelta, clipRecord.anchorAbsoluteTime]);
          }
        }

        // Now we figure out which of these time deltas maximizes the number
        // of time coherent points in the track 
        // In other words, which time delta has the most frequency points with
        // this rule respected:
        //   abs time of track freq point = abs time of anchor freq note + delta
        const maxTimeDeltaCount = 0;
        const maxTimeDelta = 0;

        for (const currTimeDelta of timeDeltas) {
          // TODO: is it possible to do this step out with an SQL query?
        }

        return {
          trackId,
          timeDelta: maxTimeDelta,
        };
      });
    }

    // Wait for all the time coherency jobs to complete
    await Promise.all(timeCoherencyJobs);

    // TODO: pick the top maxResults results

    const trackMatches: RecordsSearchMatch[] = [];

    throw 'TODO: implement';
  }
}
