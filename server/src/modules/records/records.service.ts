import { Injectable } from '@nestjs/common';
import { Fingerprint } from '../fingerprint/fingerprint.types';
import { RecordsTable } from './records.types';

@Injectable()
export class RecordsService {
  private computeRecordTable(fingerprint: Fingerprint, trackId: number): RecordsTable {
    const records = new RecordsTable();

    // TODO: implement

    return records;
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
