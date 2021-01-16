import { Injectable } from '@nestjs/common';
import {
  FingerprintInfoInput,
  TrackAddDataInput,
  TrackEditDataInput,
} from './dto/catalog.inputs';
import { GetTracksArgs } from './dto/catalog.args';
import { UploadScalar } from '@/common/scalars/upload.scalar';
import { TrackEntity } from '@/entities/Track.entity';
import { Track } from './models/catalog.models';

@Injectable()
export class CatalogService {
  // TODO: implement

  static transformFromTrackEntity(track: TrackEntity | null): Track {
    if (!track)
      return null;

    return {
      id: track.id,
      addressDatabase: track.addressDatabase,
      metadata: {
        title: track.title,
        coverImage: track.coverImage,
        artists: track.artists.map(artist => artist.id),
        createdDate: track.createdDate,
        updatedDate: track.updateDate
      }
    }
  }

  static transformFromTrackEntityMany(tracks: TrackEntity[]): Track[] {
    return tracks.map(track => this.transformFromTrackEntity(track));
  }

  async getTrack(id: string): Promise<TrackEntity> {
    return {} as any;
  }

  async getTracks(args: GetTracksArgs): Promise<TrackEntity[]> {
    return [] as TrackEntity[];
  }

  async addTrack(data: TrackAddDataInput): Promise<TrackEntity> {
    return {} as any;
  }

  async editTrack(id: string, data: TrackEditDataInput): Promise<TrackEntity> {
    return {} as any;
  }

  async removeTrack(id: string): Promise<boolean> {
    return true;
  }

  async searchTrack(
    fingerprint: UploadScalar,
    info: FingerprintInfoInput,
  ): Promise<TrackEntity> {
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
