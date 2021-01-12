import { NotFoundException } from '@nestjs/common';
import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import {
  FingerprintInfoInput,
  TrackAddDataInput,
  TrackEditDataInput,
} from './dto/catalog.input';
import { GetTracksArgs } from './dto/catalog.args';
import { Track } from './models/catalog.model';
import { CatalogService } from './catalog.service';
import { PubSub } from 'apollo-server-express';
import { UploadScalar } from '@/common/scalars/upload.scalar';

const SUBSCRIPTIONS_CONFIG = {
  TRACK_ADDED: 'trackAdded',
  TRACK_EDITED: 'trackEdited',
  TRACK_REMOVED: 'trackRemoved',
};

const pubSub = new PubSub();

@Resolver((of) => Track)
export class CatalogResolver {
  constructor(private readonly catalogService: CatalogService) {}

  // ---------------
  // --- Queries ---
  // ---------------

  @Query((returns) => Track)
  async getTrack(
    @Args({ type: () => ID, name: 'id' }) id: string,
  ): Promise<Track> {
    const track = await this.catalogService.getTrack(id);
    if (!track) throw new NotFoundException();
    return track;
  }

  @Query((returns) => [Track])
  async getTracks(@Args() args: GetTracksArgs): Promise<Track[]> {
    return this.catalogService.getTracks(args);
  }

  @Query((returns) => Track)
  searchTrack(
    @Args('fingerprint') fingerprint: UploadScalar,
    @Args('fingerprintInfo') fingerprintInfo: FingerprintInfoInput,
  ): Promise<Track> {
    return this.catalogService.searchTrack(fingerprint, fingerprintInfo);
  }

  // -----------------
  // --- Mutations ---
  // -----------------

  @Mutation((returns) => Track)
  async addTrack(
    @Args('trackData') trackData: TrackAddDataInput,
  ): Promise<Track> {
    const track = await this.catalogService.addTrack(trackData);
    pubSub.publish(SUBSCRIPTIONS_CONFIG.TRACK_ADDED, { trackAdded: track });
    return track;
  }

  @Mutation((returns) => Track)
  async editTrack(
    @Args({ type: () => ID, name: 'id' }) id: string,
    @Args('trackData') trackData: TrackEditDataInput,
  ): Promise<Track> {
    const track = await this.catalogService.editTrack(id, trackData);
    if (!track) throw new NotFoundException();
    pubSub.publish(SUBSCRIPTIONS_CONFIG.TRACK_EDITED, { editedTrack: track });
    return track;
  }

  @Mutation((returns) => Boolean)
  async removeTrack(
    @Args({ type: () => ID, name: 'id' }) id: string,
  ): Promise<boolean> {
    const removed = await this.catalogService.removeTrack(id);
    if (removed)
      pubSub.publish(SUBSCRIPTIONS_CONFIG.TRACK_REMOVED, { trackId: id });
    return removed;
  }

  @Mutation((returns) => Boolean)
  async recomputeTrackFingerprint(
    @Args({ type: () => ID, name: 'id' }) id: string,
    @Args('fingerprint') fingerprint: UploadScalar,
    @Args('fingerprintInfo') fingerprintInfo: FingerprintInfoInput,
  ): Promise<boolean> {
    return this.recomputeTrackFingerprint(id, fingerprint, fingerprintInfo);
  }

  // ---------------------
  // --- Subscriptions ---
  // ---------------------

  @Subscription((returns) => Track)
  trackAdded() {
    return pubSub.asyncIterator(SUBSCRIPTIONS_CONFIG.TRACK_ADDED);
  }

  @Subscription((returns) => Track, {
    filter: (payload, variables) =>
      variables.id ? payload.editedTrack.id === variables.id : true,
  })
  trackEdited() {
    return pubSub.asyncIterator(SUBSCRIPTIONS_CONFIG.TRACK_EDITED);
  }

  @Subscription((returns) => String, {
    filter: (payload, variables) =>
      variables.id ? payload.trackId === variables.id : true,
  })
  trackRemoved() {
    return pubSub.asyncIterator(SUBSCRIPTIONS_CONFIG.TRACK_REMOVED);
  }
}
