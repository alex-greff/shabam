import { Injectable } from '@nestjs/common';
import { Fingerprint } from '../fingerprint/types';
import { AddressRecords } from './types';

@Injectable()
export class AddressService {
  private computeAddresses(fingerprint: Fingerprint, trackId: number): AddressRecords {
    const records = new AddressRecords();

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
