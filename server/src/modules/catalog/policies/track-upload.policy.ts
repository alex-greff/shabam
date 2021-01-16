import { TrackEntity } from '@/entities/Track.entity';
import { Action, PolicyHandlerCallback } from '@/modules/policies/policy.types';

export const TrackUploadPolicy: PolicyHandlerCallback = (ability, context) =>
  ability.can(Action.Create, TrackEntity);
