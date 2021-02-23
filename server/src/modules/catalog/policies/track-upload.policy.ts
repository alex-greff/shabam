import { TrackEntity } from '@/entities/Track.entity';
import { Action, PolicyHandlerCallback } from '@/modules/policies/policy.types';

export const TrackUploadPolicy: PolicyHandlerCallback = (
  ability,
  currentUser,
  context,
) => ability.can(currentUser, Action.Create, TrackEntity);
