import { Injectable } from '@nestjs/common';
import {
  FingerprintInfoInput,
  TrackAddDataInput,
  TrackEditDataInput,
} from './dto/catalog.inputs';
import { GetTracksArgs } from './dto/catalog.args';
import { Track } from './models/catalog.models';
import { UploadScalar } from '@/common/scalars/upload.scalar';

@Injectable()
export class CatalogService {
  // TODO: implement

  async getTrack(id: string): Promise<Track> {
    return {} as any;
  }

  async getTracks(args: GetTracksArgs): Promise<Track[]> {
    return [] as Track[];
  }

  async addTrack(data: TrackAddDataInput): Promise<Track> {
    return {} as any;
  }

  async editTrack(id: string, data: TrackEditDataInput): Promise<Track> {
    return {} as any;
  }

  async removeTrack(id: string): Promise<boolean> {
    return true;
  }

  async searchTrack(
    fingerprint: UploadScalar,
    info: FingerprintInfoInput,
  ): Promise<Track> {
    return null;
  }

  async recomputeTrackFingerprint(
    id: string,
    fingerprint: UploadScalar,
    info: FingerprintInfoInput
  ): Promise<boolean> {
    return false;
  }
}
