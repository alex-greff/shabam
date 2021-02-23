import { Action, AppAbility } from '@/modules/policies/policy.types';
import { Reflector } from '@nestjs/core';
import {
  MutateTrackPolicyHandler,
  MutateTrackPolicyHandlerConfig,
} from './MutateTrackPolicyHandler';
import { TrackEntity } from '@/entities/Track.entity';
import { CatalogService } from '../catalog.service';
import { Injectable, SetMetadata } from '@nestjs/common';
import { UserAccountEntity } from '@/entities/UserAccount.entity';

const CONFIG_KEY = 'EDIT_TRACK_POLICY_CONFIG_KEY';

@Injectable()
export class TrackEditPolicy extends MutateTrackPolicyHandler {
  constructor(readonly reflector: Reflector, catalogService: CatalogService) {
    super(reflector, catalogService, CONFIG_KEY);
  }

  static configure(config: MutateTrackPolicyHandlerConfig) {
    return SetMetadata(CONFIG_KEY, config);
  }

  handleTrack(
    ability: AppAbility,
    currentUser: UserAccountEntity,
    targetTrack: TrackEntity,
  ) {
    return ability.can(currentUser, Action.Update, targetTrack);
  }
}
