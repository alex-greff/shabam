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

  // Maps track IDs to all the (address, couple) tuples that exist for it
  private trackIdToDataTableEntries: Map<number, [number, bigint][]> =
    new Map();

  protected flushRecords(chunk: RecordsChunk): void | Promise<void> {
    assert(chunk.addressesEncoded.length === chunk.couplesEncoded.length);

    const numRecords = chunk.couplesEncoded.length;

    for (let i = 0; i < numRecords; i++) {
      const addressEnc = chunk.addressesEncoded[i];
      const coupleEnc = chunk.couplesEncoded[i];

      const dtCouplesEnc = this.dataTable.get(addressEnc);
      if (dtCouplesEnc === undefined)
        this.dataTable.set(addressEnc, [coupleEnc]);
      else dtCouplesEnc.push(coupleEnc);

      const { trackId } = decodeCouple(coupleEnc);
      const trackIdToDataTableEntry =
        this.trackIdToDataTableEntries.get(trackId);
      if (trackIdToDataTableEntry === undefined)
        this.trackIdToDataTableEntries.set(trackId, [[addressEnc, coupleEnc]]);
      else trackIdToDataTableEntry.push([addressEnc, coupleEnc]);
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

    // Tracks all couples that had a full target zone worth of hits
    const coupleWithTZHit = new Set<bigint>();

    // Populate `trackIdToTotalTZHits` from `coupleToHitCounts` and filter out
    // any couples that do not form a target zone
    for (const [coupleEnc, numHits] of coupleToHitCounts) {
      // Ignore couples that appear less than TARGET_ZONE_SIZE times
      // (i.e. a full target zone was not matched for this anchor)
      // (i.e. all points that don't form a target zone)
      // TODO: the article used 4 but I used 5 here, I should double check
      // again to see if this is right and he made a typo
      if (numHits < config.TARGET_ZONE_SIZE) continue;

      coupleWithTZHit.add(coupleEnc);

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

    // // TODO: put in the time coherency checks
    // // for now we're just returning the results here
    // const _trackMatches: RecordsSearchMatch[] = [];
    // for (const [trackId, totalTZHits] of trackIdToTotalTZHits) {
    //   _trackMatches.push({ trackId, similarity: totalTZHits });
    // }
    // return _trackMatches;

    // ----------------------------
    // --- Time Coherency Phase ---
    // ----------------------------

    // The possible deltas that we need to check
    const possibleDeltas: Set<number> = new Set();

    

    // Go through each clip record and record the delta between the
    // absolute time of the clip record anchor in the song and the absolute time
    // of the matching data table record(s) in the song
    for (const clipRecord of clipRecordsTable) {
      const clipAddressEnc = encodeAddress({
        anchorFreq: clipRecord.anchorFreq,
        pointFreq: clipRecord.pointFreq,
        delta: clipRecord.delta,
      });

      // Lookup all couples that match the current clip address
      const dtCouplesEnc = this.dataTable.get(clipAddressEnc);

      if (dtCouplesEnc === undefined) continue;

      for (const dtCoupleEnc of dtCouplesEnc) {
        const { absTime: dtRecordAbsoluteTime } = decodeCouple(dtCoupleEnc);

        const delta = clipRecord.anchorAbsoluteTime - dtRecordAbsoluteTime;
        possibleDeltas.add(delta);
      }
    }

    console.log("possible deltas", possibleDeltas); // TODO: remove

    // We now count for each possible delta how many notes match the formula
    // absolute time of note in track = absolute time of note in record + delta
    // Note 1: by "notes" we mean the frequency points in the fingerprint
    // Note 2: we can use the anchors of reach record to reconstruct the notes
    // in the song. This is because most notes (other than near the end) become
    // anchors.

    // Pseudo-code:
    // 1. numDeltaHits: Map<number, number>
    //      // Possible delta to number of
    //      // trackRecord.absTime = clipRecord.absTime + possibleDelta
    //      // that match for it
    // 2. For each remaining track (keys of trackIdToTotalTZHits):
    // 3.   For each trackRecord in the records of track:
    // 4.      For each clipRecord in clipRecordsTable:
    // 5.        For each possibleDelta in possibleDeltas:
    // 6.          if (trackRecord.absTime = clipRecord.absTime + possibleDelta)
    // 7.            increment numDeltaHits[possibleDelta];

    // Maps each possible delta to the number of
    // trackRecord.absTime = clipRecord.absTime + possibleDelta that match
    // for it
    const numDeltaHits: Map<number, number> = new Map();
    // The same as numDeltaHits but divided for each possible track
    // maps possible delta to (map of track IDs to number of hits)
    const numDeltaHitsPerTrack: Map<number, Map<number, number>> = new Map();

    let bestPossibleDelta = -1;
    let bestPossibleDeltaNumHits = -1;

    const remainingTracks = trackIdToTotalTZHits.keys();
    for (const trackId of remainingTracks) {
      const trackDataTableEntries = this.trackIdToDataTableEntries.get(trackId);
      assert(trackDataTableEntries !== undefined);

      for (const [_, trackCoupleEnc] of trackDataTableEntries) {
        const { absTime: trackRecordAnchorAbsTime } =
          decodeCouple(trackCoupleEnc);

        for (const clipRecord of clipRecordsTable) {
          const clipRecordAnchorAbsTime = clipRecord.anchorAbsoluteTime;

          for (const possibleDelta of possibleDeltas) {
            const coherencyMatch =
              trackRecordAnchorAbsTime ===
              clipRecordAnchorAbsTime + possibleDelta;

            if (coherencyMatch) {
              // Update numDeltaHits and the tracker for the best delta
              let updatedNumHits = numDeltaHits.get(possibleDelta) ?? 0;
              updatedNumHits++;
              numDeltaHits.set(possibleDelta, updatedNumHits);

              if (updatedNumHits > bestPossibleDeltaNumHits) {
                bestPossibleDelta = possibleDelta;
                bestPossibleDeltaNumHits = updatedNumHits;
              }

              // Update numDeltaHitsPerTrack
              const numHitsForTrackMap =
                numDeltaHitsPerTrack.get(possibleDelta);
              if (numHitsForTrackMap === undefined) {
                const newNumHitsForTrackMap: Map<number, number> = new Map();
                newNumHitsForTrackMap.set(trackId, 1);
                numDeltaHitsPerTrack.set(possibleDelta, newNumHitsForTrackMap);
              } else {
                let updatedNumHitsForTrack =
                  numHitsForTrackMap.get(trackId) ?? 0;
                updatedNumHitsForTrack++;
                numHitsForTrackMap.set(trackId, updatedNumHitsForTrack);
              }
            }
          }
        }
      }
    }

    assert(bestPossibleDelta > -1);
    const bestNumDeltaHitsPerTrackMap = numDeltaHitsPerTrack.get(bestPossibleDelta);
    assert(bestNumDeltaHitsPerTrackMap !== undefined);

    const trackMatches: RecordsSearchMatch[] = [];
    for (const [trackId, numTimeCoherentNotes] of bestNumDeltaHitsPerTrackMap) {
      trackMatches.push({ trackId, similarity: numTimeCoherentNotes });
    }
    return trackMatches;
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
