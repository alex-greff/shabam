import { TrackEntity } from '@/entities/Track.entity';
import { UserAccountEntity } from '@/entities/UserAccount.entity';
import { Ability } from '@casl/ability';
import { DynamicModule, ExecutionContext, Type } from '@nestjs/common';

export enum UserRoles {
  Admin = 2,
  Distributor = 1,
  Default = 0,
}

export enum Action {
  Manage = 'manage', // special CASL term for everything
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects =
  | typeof TrackEntity
  | typeof UserAccountEntity
  | TrackEntity
  | UserAccountEntity
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

export interface IPolicyHandler {
  handle(
    ability: AppAbility,
    context: ExecutionContext,
  ): boolean | Promise<boolean>;
}

export type PolicyHandlerCallback = (
  ability: AppAbility,
  context: ExecutionContext,
) => boolean | Promise<boolean>;

export type PolicyHandler =
  | DynamicModule
  | IPolicyHandler
  | Type<IPolicyHandler>
  | PolicyHandlerCallback;
