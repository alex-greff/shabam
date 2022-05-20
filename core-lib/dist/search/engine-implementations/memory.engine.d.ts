import { RecordsChunk, RecordsEngine } from "../engine";
import { RecordsTable } from "../records-table";
import { RecordsSearchMatch } from "../types";
/**
 * An implementation of the records engine that stores the data entirely in RAM.
 */
export declare class MemoryRecordsEngine extends RecordsEngine {
    private dataTable;
    protected flushRecords(chunk: RecordsChunk): void | Promise<void>;
    searchRecords(clipRecordsTable: RecordsTable): RecordsSearchMatch[] | Promise<RecordsSearchMatch[]>;
    clearRecords(removeTrackId: number): void | Promise<void>;
}
