import { Injectable, NotFoundException } from '@nestjs/common';
import { TrackAddDataInput, TrackEditDataInput } from './dto/catalog.inputs';
import { GetTracksArgs } from './dto/catalog.args';
import { UserRequestData } from '@/types';
import { UserService } from '../user/user.service';
import { TrackEntity } from '@/entities/Track.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, FilterQuery, MikroORM } from '@mikro-orm/core';
import { ArtistService } from '../artist/artist.service';

@Injectable()
export class CatalogService {
  constructor(
    private readonly orm: MikroORM,
    @InjectRepository(TrackEntity)
    private readonly trackRepository: EntityRepository<TrackEntity>,
    private readonly userService: UserService,
    private readonly artistService: ArtistService,
  ) {}

  async getTrack(id: number): Promise<TrackEntity> {
    const track = await this.trackRepository.findOne({ id });

    if (!track) throw new NotFoundException('Track not found');

    return track;
  }

  async getTracks(args: GetTracksArgs): Promise<TrackEntity[]> {
    let query: FilterQuery<TrackEntity> = {};

    if (args.filter && args.filter.uploader) {
      query = {
        uploaderUser: { username: args.filter.uploader },
      };
    }

    const tracksTuple = await this.trackRepository.findAndCount(query, {
      limit: args.limit,
      offset: args.offset,
    });
    return tracksTuple[0];
  }

  async addTrack(
    data: TrackAddDataInput,
    userData: UserRequestData,
  ): Promise<TrackEntity> {
    // TODO: upload the cover image, if it exists
    const coverImage = null;

    // Get the user who created the track
    const user = await this.userService.findUser(userData.username);
    if (!user) throw new NotFoundException('Username does not exist');

    // TODO: upload image

    // Begin transaction
    const em = this.orm.em.fork();
    await em.begin();

    const track = em.create(TrackEntity, {
      title: data.title,
      addressDatabase: -1,
      coverImage,
      createdDate: new Date(),
      updateDate: new Date(),
      releaseDate: data.releaseDate,
      uploaderUser: user,
    });

    // Create the collaborations
    for (const artistCollab of data.artists) {
      const artist = await this.artistService.findOrCreateArtistByName(
        artistCollab.name,
      );
      await this.artistService.addCollaboration(
        artist,
        artistCollab.type,
        track,
      );
    }

    em.persist(track);

    const fingerprintData = await data.fingerprint.fingerprintData;
    console.log('fingerprint data', fingerprintData);

    // TODO: save the fingerprint to the address database, rollback transaction
    // and exit with exception if it fails

    // TODO: update the address database field in `track`
    const addressDatabase = 0;

    // console.log("Track collaborators", track.collaborators.getItems()); // TODO: remove

    // Finalize transaction
    await em.commit();

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
