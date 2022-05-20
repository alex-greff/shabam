import { RecordsTable } from "./records-table";
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
export declare abstract class RecordsEngine {
    /**
     * Flushes the given chunk.
     */
    protected abstract flushRecords(chunk: RecordsChunk): Promise<void> | void;
    /**
     * Stores the records table. If `chunkRecords` is enabled, then the record
     * table will be flushed in `FLUSH_EVERY_NTH_ITEMS` sized record chunks.
     */
    storeRecords(recordsTable: RecordsTable, chunkRecords?: boolean): Promise<void>;
    /**
     * Searches all the records against the given records table clip.
     */
    abstract searchRecords(clipRecordsTable: RecordsTable): Promise<RecordsSearchMatch[]> | RecordsSearchMatch[];
    /**
     * Clears all records belonging to `trackId`.
     */
    abstract clearRecords(trackId: number): Promise<void> | void;
}
