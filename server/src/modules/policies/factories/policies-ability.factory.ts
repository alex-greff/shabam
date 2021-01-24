import { Injectable } from "@nestjs/common";
import { Ability, AbilityBuilder, AbilityClass } from "@casl/ability";
import { TrackEntity } from "@/entities/Track.entity";
import { UserAccountEntity } from "@/entities/UserAccount.entity";
import { Action, UserRole, Subjects, AppAbility } from "../policy.types";

@Injectable()
export class PoliciesAbilityFactory {
  createForUser(user: UserAccountEntity) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    // Default user:

    // Can only update own account, but not own role
    can(Action.Update, UserAccountEntity, { id: user.id });
    cannot(Action.Update, UserAccountEntity, [ "role" ]);

    // Can only delete its own account
    can(Action.Delete, UserAccountEntity, { id: user.id });

    if (user.role >= UserRole.Distributor) {
      // Can create, update and delete own tracks
      can(Action.Create, TrackEntity);
      can(Action.Update, TrackEntity, { uploaderUser: { id: user.id } });
      can(Action.Delete, TrackEntity, { uploaderUser: { id: user.id } });
    }

    if (user.role >= UserRole.Admin) {
      // Has read-write access to everything
      can(Action.Manage, "all"); 
    } 

    return build({
      // https://github.com/stalniy/casl/issues/430
      detectSubjectType: type => type!.constructor as any
    });
  }
}
