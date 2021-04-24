import { AppAbility } from '@/modules/policies/policy.types';
import { ConfigurablePolicyHandler } from '@/modules/policies/ConfigurablePolicyHandler';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as Utilities from '@/utilities';
import { CatalogService } from '../catalog.service';
import { UserAccountEntity } from '@/entities/UserAccount.entity';
import { TrackEntity } from '@/entities/Track.entity';

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
    currentUser: UserAccountEntity,
    targetTrack: TrackEntity,
  ): boolean | Promise<boolean>;

  async handle(ability: AppAbility, user: UserAccountEntity, context: ExecutionContext) {
    const config = this.getConfig(context);

    const ctx = GqlExecutionContext.create(context);

    const targetTrackId = Utilities.getIn(
      ctx.getArgs(),
      config.targetTrackPath,
    );
    if (!targetTrackId) return false;

    const targetTrack = await this.catalogService.getTrack(targetTrackId);
    if (!targetTrack) return false;

    return this.handleTrack(ability, user, targetTrack);
  }
}
