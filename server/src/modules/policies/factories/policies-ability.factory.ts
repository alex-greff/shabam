import { Injectable } from '@nestjs/common';
import { TrackEntity } from '@/entities/Track.entity';
import { UserAccountEntity } from '@/entities/UserAccount.entity';
import { Action, UserRole, Subjects, AppAbility, Scopes } from '../policy.types';
import { Ability } from 'abilitee';

@Injectable()
export class PoliciesAbilityFactory {
  createForUser(user: UserAccountEntity) {
    const ability: AppAbility = new Ability<Subjects, Action, Scopes>();

    // Default user:

    // Can can update and delete own account
    ability.allow(
      UserAccountEntity,
      [Action.Update, Action.Delete],
      UserAccountEntity,
      { id: user.id },
    );

    // Cannot update own role
    ability.disallow(
      UserAccountEntity,
      Action.Update,
      UserAccountEntity,
      "role"
    );

    // Distributer specific abilities:
    if (user.role >= UserRole.Distributor) {
      // Can create tracks
      ability.allow(UserAccountEntity, Action.Create, TrackEntity);

      // Can update and delete own tracks
      ability.allow(
        UserAccountEntity,
        [Action.Update, Action.Delete],
        TrackEntity,
        (user, track) => track.uploaderUser.id === user.id,
      );
    }


    // Admin specific abilities:
    if (user.role >= UserRole.Admin) {
      // Has read-write access to everything
      ability.allow(UserAccountEntity, "$manage", "$all");
    }

    return ability;
  }
}
