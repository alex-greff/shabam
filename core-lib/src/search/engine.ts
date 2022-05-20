import { RecordsTable } from "./records-table";
import { config } from "../configuration";
import { encodeAddress, encodeCouple } from "./encode";
import { RecordsSearchMatch } from "./types";

/**
 * Represents a single records chunk.
 */
export interface RecordsChunk {
  /**
   * The sequence number of this chunk (starts from 1)
   */
  chunkNumber: number;
  /**
   * The accumulation of encoded addresses.
   * Note: addressesEncoded.length == couplesEncoded.length
   */
  addressesEncoded: number[];
  /**
   * The accumulation of encoded couples.
   * Note: addressesEncoded.length == couplesEncoded.length
   */
  couplesEncoded: bigint[];
}

/**
 * The base class used for implementing record search and storage operations
 * using different storage backends.
 */
export abstract class RecordsEngine {
  /**
   * Flushes the given chunk.
   */
  protected abstract flushRecords(chunk: RecordsChunk): Promise<void> | void;

  /**
   * Stores the records table. If `chunkRecords` is enabled, then the record
   * table will be flushed in `FLUSH_EVERY_NTH_ITEMS` sized record chunks.
   */
  async storeRecords(recordsTable: RecordsTable, chunkRecords: boolean = true) {
    let chunkNumber = 1;
    let addressesEncodedAcc: number[] = [];
    let couplesEncodedAcc: bigint[] = [];

    let i = 0;
    for (const record of recordsTable) {
      // New chunk, flush the accumulated data and reset the accumulators
      if (chunkRecords && i % config.FLUSH_EVERY_NTH_ITEMS === 0) {
        if (i !== 0) {
          const chunk: RecordsChunk = {
            chunkNumber,
            addressesEncoded: addressesEncodedAcc,
            couplesEncoded: couplesEncodedAcc,
          };
          await this.flushRecords(chunk);

          chunkNumber++;
          addressesEncodedAcc = [];
          couplesEncodedAcc = [];
        }
      }

      // Add this record to the accumulator
      const addressEnc = encodeAddress({
        anchorFreq: record.anchorFreq,
        pointFreq: record.pointFreq,
        delta: record.delta,
      });

      const coupleEnc = encodeCouple({
        absTime: record.anchorAbsoluteTime,
        trackId: recordsTable.trackId,
      });

      addressesEncodedAcc.push(addressEnc);
      couplesEncodedAcc.push(coupleEnc);

      i++;
    }

    // Flush any remaining chunks at the end
    // If chunkRecords == false, this will flush the entire records table
    const chunk: RecordsChunk = {
      chunkNumber,
      addressesEncoded: addressesEncodedAcc,
      couplesEncoded: couplesEncodedAcc,
    };
    await this.flushRecords(chunk);
  }

  /**
   * Searches all the records against the given records table clip.
   */
  abstract searchRecords(
    clipRecordsTable: RecordsTable
  ): Promise<RecordsSearchMatch[]> | RecordsSearchMatch[];

  /**
   * Clears all records belonging to `trackId`.
   */
  abstract clearRecords(trackId: number): Promise<void> | void;
}
