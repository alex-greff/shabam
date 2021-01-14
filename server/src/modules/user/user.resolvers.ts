import { ExecutionContext, ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Permissions, PermissionsConfig } from "@/modules/auth/decorators/permissions.decorator";
import { UserService } from './user.service';
import { UpdateUserCredentialsInput } from './dto/user.inputs';
import {} from './dto/user.args';
import {} from './models/user.models';
import { AuthService } from '@/modules/auth/auth.service';
import { GqlJwtAuthGuard } from '@/modules/auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { PermitSelfGuard } from './guards/permit-self.guard';
import { CheckPolicies } from '../policies/dectorators/check-policies.decorator';
import { UserIsSelfPolicy } from './policies/user-is-self.policy';
import { PoliciesGuard } from '../policies/guards/policies.guard';
import { AppAbility } from '../policies/policy.types';

// TODO: implement guards

@Resolver('User')
export class UserResolvers {
  constructor(private readonly userService: UserService) {}

  // ---------------
  // --- Queries ---
  // ---------------

  @Query((returns) => Boolean, {
    description: 'Checks if the given username is available. ',
  })
  async checkUsernameAvailability(
    @Args('username') username: string,
  ): Promise<boolean> {
    return this.userService.checkUsernameAvailability(username);
  }

  // -----------------
  // --- Mutations ---
  // -----------------

  @Mutation((returns) => Boolean, {
    description: "Edits a user's account details.",
  })
  // @Permissions("edit-user")
  // @PermissionsConfig({ usernamePath: "username" })
  // @UseGuards(GqlJwtAuthGuard, PermitSelfGuard, RolesGuard)

  // @CheckPolicies(UserIsSelfPolicy)
  // @CheckPolicies(new UserIsSelfPolicyTemp())

  // @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @CheckPolicies(UserIsSelfPolicy, (ability: AppAbility) => true)
  @UseGuards(GqlJwtAuthGuard, PoliciesGuard)
  async editUser(
    @Args('username') username: string,
    @Args('updatedCredentials') updatedCredentials: UpdateUserCredentialsInput,
  ): Promise<boolean> {
    return this.userService.editUser(username, updatedCredentials);
  }

  @Mutation((returns) => Boolean, { description: "Edits a user's role." })
  async editUserRole(
    @Args('username') username: string,
    @Args('updatedRole') updatedRole: string,
  ): Promise<boolean> {
    return this.userService.editUserRole(username, updatedRole);
  }

  @Mutation((returns) => Boolean, { description: 'Deletes a user account.' })
  async removeUser(@Args('username') username: string): Promise<boolean> {
    return this.userService.removeUser(username);
  }
}
