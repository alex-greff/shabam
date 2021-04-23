import { Injectable, NotFoundException } from '@nestjs/common';
import {
  TrackAddDataInput,
  TrackEditDataInput,
} from './dto/catalog.inputs';
import { GetTracksArgs } from './dto/catalog.args';
import { UserRequestData } from '@/types';
import { UserService } from '../user/user.service';
import { TrackEntity } from '@/entities/Track.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { ArtistEntity } from '@/entities/Artist.entity';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(TrackEntity)
    private readonly trackRepository: EntityRepository<TrackEntity>,
    private readonly userService: UserService,
  ) {}

  async getTrack(id: string): Promise<TrackEntity> {
    // TODO: implement
    return {} as any;
  }

  async getTracks(args: GetTracksArgs): Promise<TrackEntity[]> {
    // TODO: implement
    return [] as TrackEntity[];
  }

  async addTrack(data: TrackAddDataInput, userData: UserRequestData): Promise<TrackEntity> {
    // TODO: save the addresses and get the address database where it was saved
    const addressDatabase = 0;

    // TODO: get the artists
    const artists: ArtistEntity[] = [];

    // TODO: upload the cover image, if it exists
    const coverImage = null;

    // Get the user who created the track
    const user = await this.userService.findUser(userData.username);
    if (!user) 
      throw new NotFoundException("Username does not exist");

    // console.log("DATA", data); // TODO: remove

    // Create the track
    const track = this.trackRepository.create({ 
      title: data.title,
      addressDatabase, 
      artists,
      coverImage,
      createdDate: new Date(),
      updateDate: new Date(),
      releaseDate: data.releaseDate,
      uploaderUser: user,
    });

    // console.log("Track", track); // TODO: remove

    await this.trackRepository.persistAndFlush(track);

    return track;
  }

  async editTrack(id: string, data: TrackEditDataInput): Promise<TrackEntity> {
    // TODO: implement
    return {} as any;
  }

  async removeTrack(id: string): Promise<boolean> {
    // TODO: implement
    return true;
  }

  // TODO: remove
  // async searchTrack(
  //   fingerprint: UploadScalar,
  //   info: FingerprintInfoInput,
  // ): Promise<SearchEntity> {
  //   // TODO: implement
  //   return null;
  // }

  // async recomputeTrackFingerprint(
  //   id: string,
  //   fingerprint: UploadScalar,
  //   info: FingerprintInfoInput,
  // ): Promise<boolean> {
  //   // TODO: implement
  //   return false;
  // }
}
