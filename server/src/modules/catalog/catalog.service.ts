import { Injectable } from '@nestjs/common';
import {
  FingerprintInfoInput,
  TrackAddDataInput,
  TrackEditDataInput,
} from './dto/catalog.inputs';
import { GetTracksArgs } from './dto/catalog.args';
import { UploadScalar } from '@/common/scalars/upload.scalar';
import { TrackEntity } from '@/entities/Track.entity';
import { Track, TrackSearchResult } from './models/catalog.models';
import { SearchEntity } from '@/entities/Search.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(TrackEntity)
    private trackRepository: Repository<TrackEntity>
  ) {}

  static transformFromTrackEntity(track: TrackEntity | null): Track {
    if (!track) return null;

    return {
      id: track.id,
      addressDatabase: track.addressDatabase,
      metadata: {
        title: track.title,
        coverImage: track.coverImage,
        artists: track.artists.map((artist) => artist.id),
        createdDate: track.createdDate,
        updatedDate: track.updateDate,
      },
    };
  }

  static transformFromSearchEntity(search: SearchEntity): TrackSearchResult[] {
    return search.results.map((result) => ({
      track: this.transformFromTrackEntity(result.track),
      similarity: result.similarity,
    }));
  }

  static transformFromTrackEntityMany(tracks: TrackEntity[]): Track[] {
    return tracks.map((track) => this.transformFromTrackEntity(track));
  }

  async getTrack(id: string): Promise<TrackEntity> {
    // TODO: implement
    return {} as any;
  }

  async getTracks(args: GetTracksArgs): Promise<TrackEntity[]> {
    // TODO: implement
    return [] as TrackEntity[];
  }

  async addTrack(data: TrackAddDataInput): Promise<TrackEntity> {
    // TODO: implement
    return {} as any;
  }

  async editTrack(id: string, data: TrackEditDataInput): Promise<TrackEntity> {
    // TODO: implement
    return {} as any;
  }

  async removeTrack(id: string): Promise<boolean> {
    // TODO: implement
    return true;
  }

  async searchTrack(
    fingerprint: UploadScalar,
    info: FingerprintInfoInput,
  ): Promise<SearchEntity> {
    // TODO: implement
    return null;
  }

  async recomputeTrackFingerprint(
    id: string,
    fingerprint: UploadScalar,
    info: FingerprintInfoInput,
  ): Promise<boolean> {
    // TODO: implement
    return false;
  }
}
