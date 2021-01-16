import { AppAbility } from '@/modules/policies/policy.types';
import { ConfigurablePolicyHandler } from '@/modules/policies/ConfigurablePolicyHandler';
import { ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as Utilities from '@/utilities';
import { TrackEntity } from '@/entities/Track.entity';
import { CatalogService } from '../catalog.service';

export interface MutateTrackPolicyHandlerConfig {
  targetTrackPath: string;
}

const DEFAULT_CONFIG: MutateTrackPolicyHandlerConfig = {
  targetTrackPath: 'id',
};

@Injectable()
export abstract class MutateTrackPolicyHandler extends ConfigurablePolicyHandler<MutateTrackPolicyHandlerConfig> {
  constructor(
    readonly reflector: Reflector,
    private readonly catalogService: CatalogService,
    configKey: string,
  ) {
    super(reflector, configKey, DEFAULT_CONFIG);
  }

  protected abstract handleTrack(
    ability: AppAbility,
    targetTrack: TrackEntity,
  ): boolean | Promise<boolean>;

  async handle(ability: AppAbility, context: ExecutionContext) {
    const config = this.getConfig(context);

    const ctx = GqlExecutionContext.create(context);

    const targetTrackId = Utilities.getIn(
      ctx.getArgs(),
      config.targetTrackPath,
    );
    if (!targetTrackId) return false;

    const targetTrack = await this.catalogService.getTrack(targetTrackId);
    if (!targetTrack) return false;

    return this.handleTrack(ability, targetTrack);
  }
}
