import { NotFoundException } from '@nestjs/common';
import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'apollo-server-express';
import { CatalogService } from './catalog.service';
import {
  FingerprintInfoInput,
  TrackAddDataInput,
  TrackEditDataInput,
} from './dto/catalog.inputs';
import { GetTracksArgs } from './dto/catalog.args';
import { Track } from './models/catalog.models';
import { UploadScalar } from '@/common/scalars/upload.scalar';

const SUBSCRIPTIONS_CONFIG = {
  TRACK_ADDED: 'trackAdded',
  TRACK_EDITED: 'trackEdited',
  TRACK_REMOVED: 'trackRemoved',
};

const pubSub = new PubSub();

// TODO: implement guards

@Resolver((of) => Track)
export class CatalogResolver {
  constructor(private readonly catalogService: CatalogService) {}

  // ---------------
  // --- Queries ---
  // ---------------

  @Query((returns) => Track, {
    description: 'Get a specific track in the catalog.',
  })
  async getTrack(
    @Args({ type: () => ID, name: 'id' }) id: string,
  ): Promise<Track> {
    const track = await this.catalogService.getTrack(id);
    if (!track) throw new NotFoundException();
    return track;
  }

  @Query((returns) => [Track], {
    description: 'Get a paginated list of all tracks in the catalog.',
  })
  async getTracks(@Args() args: GetTracksArgs): Promise<Track[]> {
    return this.catalogService.getTracks(args);
  }

  @Query((returns) => Track, {
    description: 'Searches for a track based off the given audio fingerprint.',
  })
  searchTrack(
    @Args('fingerprint') fingerprint: UploadScalar,
    @Args('fingerprintInfo') fingerprintInfo: FingerprintInfoInput,
  ): Promise<Track> {
    return this.catalogService.searchTrack(fingerprint, fingerprintInfo);
  }

  // -----------------
  // --- Mutations ---
  // -----------------

  @Mutation((returns) => Track, {
    description: 'Add a new track to the catalog.',
  })
  async addTrack(
    @Args('trackData') trackData: TrackAddDataInput,
  ): Promise<Track> {
    const track = await this.catalogService.addTrack(trackData);
    pubSub.publish(SUBSCRIPTIONS_CONFIG.TRACK_ADDED, { trackAdded: track });
    return track;
  }

  @Mutation((returns) => Track, {
    description: 'Edit an existing track in the catalog.',
  })
  async editTrack(
    @Args({ type: () => ID, name: 'id' }) id: string,
    @Args('trackData') trackData: TrackEditDataInput,
  ): Promise<Track> {
    const track = await this.catalogService.editTrack(id, trackData);
    if (!track) throw new NotFoundException();
    pubSub.publish(SUBSCRIPTIONS_CONFIG.TRACK_EDITED, { editedTrack: track });
    return track;
  }

  @Mutation((returns) => Boolean, {
    description: 'Remove a track from the catalog.',
  })
  async removeTrack(
    @Args({ type: () => ID, name: 'id' }) id: string,
  ): Promise<boolean> {
    const removed = await this.catalogService.removeTrack(id);
    if (removed)
      pubSub.publish(SUBSCRIPTIONS_CONFIG.TRACK_REMOVED, { trackId: id });
    return removed;
  }

  @Mutation((returns) => Boolean, {
    description: "Recomputes a track's stored fingerprint.",
  })
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

  @Subscription((returns) => Track, {
    description: 'Notifies whenever a track is added. ',
  })
  trackAdded() {
    return pubSub.asyncIterator(SUBSCRIPTIONS_CONFIG.TRACK_ADDED);
  }

  @Subscription((returns) => Track, {
    description: 'Notifies whenever a track is added. Can filter by track id.',
    filter: (payload, variables) =>
      variables.id ? payload.editedTrack.id === variables.id : true,
  })
  trackEdited() {
    return pubSub.asyncIterator(SUBSCRIPTIONS_CONFIG.TRACK_EDITED);
  }

  @Subscription((returns) => String, {
    description:
      'Notifies whenever a track is deleted. Can filter by track id.',
    filter: (payload, variables) =>
      variables.id ? payload.trackId === variables.id : true,
  })
  trackRemoved() {
    return pubSub.asyncIterator(SUBSCRIPTIONS_CONFIG.TRACK_REMOVED);
  }
}
