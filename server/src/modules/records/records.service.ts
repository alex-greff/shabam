import { Injectable } from '@nestjs/common';
import { Fingerprint } from '../fingerprint/fingerprint.types';
import { RecordAddress, RecordsTable } from "./records.types";

@Injectable()
export class RecordsService {
  private computeRecordsTable(fingerprint: Fingerprint, trackId: number): RecordsTable {
    const recordsTable: RecordsTable = {
      addresses: [],
      trackId
    };

    // Iterate through each point of the fingerprint
    for (let i = 0; i < fingerprint.data.length / 2; i++) {
      const currWindow = fingerprint.data[i*2];
      const currPartition = fingerprint.data[i*2+1];

      // TODO: treat this point as the anchor point and compute its
      // corresponding address records
    }

    // TODO: implement

    return recordsTable;
  }

  async storeFingerprint(
    fingerprint: Fingerprint,
    trackId: number,
    addressDb: number | null = null,
  ): Promise<boolean> {
    // TODO: implement
    return false;
  }
}
