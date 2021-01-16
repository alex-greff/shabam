import { Action, AppAbility } from "@/modules/policies/policy.types";
import { Reflector } from "@nestjs/core";
import { MutateTrackPolicyHandler, MutateTrackPolicyHandlerConfig } from "./MutateTrackPolicyHandler";
import { TrackEntity } from "@/entities/Track.entity";
import { CatalogService } from "../catalog.service";
import { SetMetadata } from "@nestjs/common";

const CONFIG_KEY = "REMOVE_TRACK_POLICY_CONFIG_KEY";

export class TrackRemovePolicy extends MutateTrackPolicyHandler {
  constructor(
    readonly reflector: Reflector,
    catalogService: CatalogService
  ) {
    super(reflector, catalogService, CONFIG_KEY);
  }

  static configure(config: MutateTrackPolicyHandlerConfig) {
    return SetMetadata(CONFIG_KEY, config);
  }

  handleTrack(ability: AppAbility, targetTrack: TrackEntity) {
    return ability.can(Action.Update, targetTrack);
  }
}