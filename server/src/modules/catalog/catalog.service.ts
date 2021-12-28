import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  SearchArgs,
  TrackAddDataInput,
  TrackAddDataInputWithFile,
  TrackEditDataInput,
} from './dto/catalog.inputs';
import { GetTracksArgs, TracksFilterInput } from './dto/catalog.args';
import { UserRequestData } from '@/types';
import { UserService } from '../user/user.service';
import { TrackEntity } from '@/entities/Track.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  EntityRepository,
  FilterQuery,
  MikroORM,
  Populate,
} from '@mikro-orm/core';
import { ArtistService } from '../artist/artist.service';
import { FingerprintService } from '../fingerprint/fingerprint.service';
import { RecordsService } from '../records/records.service';
import {
  ClipRecordsTable,
  RecordsSearchMatch,
  RecordsTable,
} from '../records/records.types';
import { SearchEntity } from '@/entities/Search.entity';
import { FingerprintInput } from '../fingerprint/dto/fingerprint.inputs';
import { SearchResultEntity } from '@/entities/SearchResult.entity';
import * as AudioUtilities from '@/utilities/audio';
import * as AudioConfig from '@/config/audio';
import * as FingerprintLib from '@shabam/fingerprint-lib';
import { Fingerprint } from '../fingerprint/fingerprint.types';

@Injectable()
export class CatalogService {
  constructor(
    private readonly orm: MikroORM,
    // Entity repositories
    @InjectRepository(TrackEntity)
    private readonly trackRepository: EntityRepository<TrackEntity>,
    @InjectRepository(SearchEntity)
    private readonly searchRepository: EntityRepository<SearchEntity>,
    @InjectRepository(SearchResultEntity)
    private readonly searchResultRepository: EntityRepository<SearchResultEntity>,
    // Services
    private readonly userService: UserService,
    private readonly artistService: ArtistService,
    private readonly fingerprintService: FingerprintService,
    @Inject(forwardRef(() => RecordsService))
    private readonly recordsService: RecordsService,
  ) {}

  async getTrack<P extends Populate<TrackEntity> = any>(
    id: number,
    populate: P = [
      'searchResults',
      'collaborators',
      'collaborators.artist',
    ] as any, // TODO: this is a little hacky, fix it
  ): Promise<TrackEntity> {
    const track = await this.trackRepository.findOne({ id }, populate);

    if (!track) throw new NotFoundException('Track not found');

    return track;
  }

  private constructTracksFilterQuery(
    filter: TracksFilterInput | undefined,
  ): FilterQuery<TrackEntity> {
    let query: FilterQuery<TrackEntity> = {};

    if (filter && filter.uploader) {
      query = {
        uploaderUser: { username: filter.uploader },
      };
    }

    return query;
  }

  async getTracks<P extends Populate<TrackEntity>>(
    args: GetTracksArgs,
    populate: P = [
      'searchResults',
      'collaborators',
      'collaborators.artist',
    ] as any, // TODO: this is a little hacky, fix it
  ): Promise<TrackEntity[]> {
    const query = this.constructTracksFilterQuery(args.filter);

    const tracksTuple = await this.trackRepository.findAndCount(query, {
      limit: args.limit,
      offset: args.offset,
      populate: populate,
    });

    const tracks = tracksTuple[0];
    return tracks;
  }

  async getTracksNumber(
    filter: TracksFilterInput | undefined,
  ): Promise<number> {
    const query = this.constructTracksFilterQuery(filter);

    const tracksNum = await this.trackRepository.count(query);
    return tracksNum;
  }

  async addTrackWithFile(
    data: TrackAddDataInputWithFile,
    userData: UserRequestData,
  ): Promise<TrackEntity> {
    // TODO: upload the cover image, if it exists
    const coverImage = null;

    // Get the user who created the track
    const user = await this.userService.findUser(userData.username);
    if (!user) throw new NotFoundException('Username does not exist');

    // TODO: upload image

    // TODO: obtain actual address db number
    const addressDbNum = 0;

    // Load the audio WAV file
    const audioFileUpload = await data.audioFile;
    // TODO: none of this code handles stereo WAVs
    const audioWav = await this.fingerprintService.loadAudioWav(
      audioFileUpload,
      true,
    );

    // Duration of the WAV file
    const duration = AudioUtilities.getWavFileDuration(
      audioWav.getSamples()[0].length,
      AudioConfig.TARGET_SAMPLE_RATE,
    );

    console.log("Duration ", duration); // TODO: remove

    throw "TODO: remove";

    // Begin transaction
    const em = this.orm.em.fork();
    await em.begin();

    const track = em.create(TrackEntity, {
      title: data.title,
      addressDatabase: addressDbNum,
      coverImage,
      createdDate: new Date(),
      updateDate: new Date(),
      duration,
      numPlays: 0,
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

    // Generate the fingerprint and store it in the fingerprint database
    try {
      // TODO: compute spectrogram using FFT
      const spectrogramData = await this.fingerprintService.computeSpectrogramData(
        audioWav,
        AudioConfig.TARGET_SAMPLE_RATE,
      );
      console.log('Spectrogram data:', spectrogramData); // TODO: remove

      // TODO: add functionality to specify which fingerprint to use

      // Generate the fingerprint
      const fingerprintData = await FingerprintLib.iterativeGenerateFingerprint(
        spectrogramData,
        { FFTSize: AudioConfig.FFT_SIZE },
      );

      console.log('Fingerprint: ', fingerprintData); // TODO: remove

      const fingerprint = new Fingerprint(
        fingerprintData.numberOfWindows,
        fingerprintData.numberOfPartitions,
        fingerprintData.data,
      );

      // Create an instance of a records table
      const recordsTable = new RecordsTable(fingerprint, track.id);

      // Store the records table in the address database
      await this.recordsService.storeRecordsTable(
        recordsTable,
        track.addressDatabase,
      );
    } catch (err) {
      // Something failed, rollback the transaction and throw the error again
      em.rollback();
      throw err;
    }

    // Finalize transaction
    await em.commit();

    return track;
  }

  // TODO: replace with addTrackWithFile
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

    // TODO: obtain actual address db number
    const addressDbNum = 0;

    // Begin transaction
    const em = this.orm.em.fork();
    await em.begin();

    const track = em.create(TrackEntity, {
      title: data.title,
      addressDatabase: addressDbNum,
      coverImage,
      createdDate: new Date(),
      updateDate: new Date(),
      duration: data.duration,
      numPlays: 0,
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

    // Unwrap the fingerprint and store it in an address database
    try {
      const fingerprint = await this.fingerprintService.unwrapFingerprintInput(
        data.fingerprint,
      );

      // console.log('FINGERPRINT', fingerprint); // TODO: remove

      // Create an instance of a records table
      const recordsTable = new RecordsTable(fingerprint, track.id);

      // Store the records table in the address database
      await this.recordsService.storeRecordsTable(
        recordsTable,
        track.addressDatabase,
      );
    } catch (err) {
      // Something failed, rollback the transaction and throw the error again
      em.rollback();
      throw err;
    }

    // console.log("Track collaborators", track.collaborators.getItems()); // TODO: remove

    // Finalize transaction
    await em.commit();

    return track;
  }

  async editTrack(id: number, data: TrackEditDataInput): Promise<TrackEntity> {
    // TODO: implement
    return {} as any;
  }

  async removeTrack(id: number): Promise<boolean> {
    const track = await this.getTrack(id);

    // Remove the track
    await this.trackRepository.removeAndFlush(track);

    // Remove any artists that do not have any tracks associated with them
    await this.artistService.cleanArtists();

    // Remove all records corresponding to the track
    await this.recordsService.removeRecords(id, track.addressDatabase);

    return true;
  }

  async searchTrack(
    fingerprintInput: FingerprintInput,
    args?: SearchArgs,
    // ): Promise<SearchEntity> { // TODO: put this back in
  ): Promise<RecordsSearchMatch[]> {
    const fingerprint = await this.fingerprintService.unwrapFingerprintInput(
      fingerprintInput,
    );
    const recordsClipTable = new ClipRecordsTable(fingerprint);

    const results = await this.recordsService.searchRecords(
      recordsClipTable,
      args?.maxResults,
    );

    // TODO: create search entity and stuff for the result
    // throw 'TODO: implement';

    // TODO: remove
    return results;
  }
}
