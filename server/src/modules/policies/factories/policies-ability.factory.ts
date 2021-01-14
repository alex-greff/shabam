import { Injectable } from "@nestjs/common";
import { TrackEntity } from "@/entities/Track.entity";
import { UserAccountEntity } from "@/entities/UserAccount.entity";
import { Ability, AbilityBuilder, AbilityClass } from "@casl/ability";
import { Action, AppAbility, Subjects, UserRoles } from "../policy.types";


@Injectable()
export class PoliciesAbilityFactory {
  createForUser(user: UserAccountEntity) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.role >= UserRoles.Admin) {
      // Has read-write access to everything
      can(Action.Manage, "all"); 
    } 

    if (user.role >= UserRoles.Distributor) {
      // Can create, update and delete own tracks
      can(Action.Create, TrackEntity, { uploaderUser: { id: user.id } });
      can(Action.Update, TrackEntity, { uploaderUser: { id: user.id } });
      can(Action.Delete, TrackEntity, { uploaderUser: { id: user.id } });
    }

    // Default user:

    // Can only update own account, but not own role
    can(Action.Update, UserAccountEntity, { id: user.id });
    cannot(Action.Update, UserAccountEntity, [ "role", "signupDate" ]);

    // Can only delete its own account
    can(Action.Delete, UserAccountEntity, { id: user.id });

    return build();
  }
}
