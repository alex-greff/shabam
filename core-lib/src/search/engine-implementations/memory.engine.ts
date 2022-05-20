import { assert } from "tsafe";
import { decodeCouple, encodeAddress } from "../encode";
import { RecordsChunk, RecordsEngine } from "../engine";
import { RecordsTable } from "../records-table";
import { RecordsSearchMatch } from "../types";
import { config } from "../../configuration";

/**
 * An implementation of the records engine that stores the data entirely in RAM.
 */
export class MemoryRecordsEngine extends RecordsEngine {
  // Maps addresses to matching couples
  private dataTable: Map<number, bigint[]> = new Map();

  protected flushRecords(chunk: RecordsChunk): void | Promise<void> {
    assert(chunk.addressesEncoded.length === chunk.couplesEncoded.length);

    const numRecords = chunk.couplesEncoded.length;

    for (let i = 0; i < numRecords; i++) {
      const addressEncoded = chunk.addressesEncoded[i];
      const coupleEncoded = chunk.couplesEncoded[i];

      const dtCouplesEnc = this.dataTable.get(addressEncoded);
      if (dtCouplesEnc === undefined)
        this.dataTable.set(addressEncoded, [coupleEncoded]);
      else dtCouplesEnc.push(coupleEncoded);
    }
  }

  searchRecords(
    clipRecordsTable: RecordsTable
  ): RecordsSearchMatch[] | Promise<RecordsSearchMatch[]> {
    // ------------------------------
    // --- Hits Compilation Phase ---
    // ------------------------------

    // A map that counts the number of times a couple appears in the clip table
    const coupleToHitCounts = new Map<bigint, number>();

    // For each record in the clip table, lookup its address in the data table
    // and accumulate its results in the `coupleHits` map
    for (const clipRecord of clipRecordsTable) {
      const clipAddressEnc = encodeAddress({
        anchorFreq: clipRecord.anchorFreq,
        pointFreq: clipRecord.pointFreq,
        delta: clipRecord.delta,
      });

      // Lookup all couples that match the current clip address
      const dtCouplesEnc = this.dataTable.get(clipAddressEnc);

      // For each couple, increment the hit counters in `coupleHits` for them
      if (dtCouplesEnc !== undefined) {
        for (const dtCoupleEnc of dtCouplesEnc) {
          const coupleHitCount = coupleToHitCounts.get(dtCoupleEnc) ?? 0;
          coupleToHitCounts.set(dtCoupleEnc, coupleHitCount + 1);
        }
      }
    }

    // -----------------------
    // --- Filtering Phase ---
    // -----------------------

    // Now that we have the couples occurrence count map we can start
    // filtering tracks

    // Tracks track IDs to the total number of hits that they had
    // in the `coupleToHitCounts` map
    // Note: TZ = target zone
    const trackIdToTotalTZHits = new Map<number, number>();

    // Populate `trackIdToTotalTZHits` from `coupleToHitCounts` and filter out
    // any couples that do not form a target zone
    for (const [coupleEnc, numHits] of coupleToHitCounts) {
      // Ignore couples that appear less than TARGET_ZONE_SIZE times
      // (i.e. a full target zone was not matched for this anchor)
      // (i.e. all points that don't form a target zone)
      // TODO: the article used 4 but I used 5 here, I should double check
      // again to see if this is right and he made a typo
      if (numHits < config.TARGET_ZONE_SIZE) continue;

      const { trackId } = decodeCouple(coupleEnc);

      const currTotalTZHits = trackIdToTotalTZHits.get(trackId) ?? 0;
      trackIdToTotalTZHits.set(trackId, currTotalTZHits + 1);
    }

    const clipTableNumTZ = clipRecordsTable.getNumTargetZones();

    // Filter out all tracks that do not pass the cutoff
    for (const [trackId, totalNumTZHits] of trackIdToTotalTZHits) {
      if (totalNumTZHits < config.SEARCH_SELECTION_COEFFICIENT * clipTableNumTZ)
        trackIdToTotalTZHits.delete(trackId);
    }

    // TODO: put in the time coherency checks
    // for now we're just returning the results here
    const _trackMatches: RecordsSearchMatch[] = [];
    for (const [trackId, totalTZHits] of trackIdToTotalTZHits) {
      _trackMatches.push({ trackId, similarity: totalTZHits });
    }
    return _trackMatches;

    // ----------------------------
    // --- Time Coherency Phase ---
    // ----------------------------

    // TODO: implement
  }

  clearRecords(removeTrackId: number): void | Promise<void> {
    // For each address item, remove all couples that reference the track id
    for (const [addressEnc, couplesEnc] of this.dataTable) {
      const updatedCouplesEnc: bigint[] = [];
      for (const coupleEnc of couplesEnc) {
        const { trackId } = decodeCouple(coupleEnc);
        if (trackId !== removeTrackId) updatedCouplesEnc.push(coupleEnc);
      }
      // We removed a couple
      if (updatedCouplesEnc.length !== couplesEnc.length)
        this.dataTable.set(addressEnc, updatedCouplesEnc);
    }
  }
}
