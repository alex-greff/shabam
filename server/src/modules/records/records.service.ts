import { Injectable } from '@nestjs/common';
import { Fingerprint } from '../fingerprint/fingerprint.types';
import { TARGET_ZONE_SIZE } from './records.config';
import { Record, RecordsTable } from './records.types';

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
  ): Promise<boolean> {
    const recordsTable = this.computeRecordsTable(fingerprint, trackId);

    // TODO: implement
    return false;
  }
}
