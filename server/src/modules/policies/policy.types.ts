import { TrackEntity } from '@/entities/Track.entity';
import { UserAccountEntity } from '@/entities/UserAccount.entity';
import { ExecutionContext, Type } from '@nestjs/common';
import { Ability } from 'abilitee';

export enum UserRole {
  Admin = 2,
  Distributor = 1,
  Default = 0,
}

export enum Action {
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects =
  | TrackEntity
  | UserAccountEntity
;

// export type AppAbility = Ability<[Action, Subjects]>;
export type AppAbility = Ability<Subjects, Action>;

export interface IPolicyHandler {
  handle(
    ability: AppAbility,
    user: UserAccountEntity,
    context: ExecutionContext
  ): boolean | Promise<boolean>;
}

export type PolicyHandlerCallback = (
  ability: AppAbility,
  user: UserAccountEntity,
  context: ExecutionContext
) => boolean | Promise<boolean>;

export type PolicyHandler =
  | IPolicyHandler
  | Type<IPolicyHandler>
  | PolicyHandlerCallback;
