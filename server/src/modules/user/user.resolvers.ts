import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Query,
  registerEnumType,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { UpdateUserCredentialsInput } from './dto/user.inputs';
import {} from './dto/user.args';
import {} from './models/user.models';
import { GqlJwtAuthGuard } from '@/modules/auth/guards/gql-jwt-auth.guard';
import { CheckPolicies } from '../policies/dectorators/check-policies.decorator';
import { UserUpdatePolicy } from './policies/user-update-policy';
import { PoliciesGuard } from '../policies/guards/policies.guard';
import { UserRole } from '../policies/policy.types';

registerEnumType(UserRole, {
  name: 'UserRole',
});

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
  @UserUpdatePolicy.configure({ targetUsernamePath: 'username' })
  @CheckPolicies(UserUpdatePolicy)
  @UseGuards(GqlJwtAuthGuard, PoliciesGuard)
  async editUser(
    @Args('username') username: string,
    @Args('updatedCredentials') updatedCredentials: UpdateUserCredentialsInput,
  ): Promise<boolean> {
    return this.userService.editUser(username, updatedCredentials);
  }

  @Mutation((returns) => Boolean, { description: "Edits a user's role." })
  @CheckPolicies(UserUpdatePolicy)
  @UseGuards(GqlJwtAuthGuard, PoliciesGuard)
  async editUserRole(
    @Args('username') username: string,
    @Args({ name: 'updatedRole', type: () => UserRole })
    updatedRole: number,
  ): Promise<boolean> {
    return this.userService.editUserRole(username, updatedRole);
  }

  @Mutation((returns) => Boolean, { description: 'Deletes a user account.' })
  @CheckPolicies(UserUpdatePolicy)
  @UseGuards(GqlJwtAuthGuard, PoliciesGuard)
  async removeUser(@Args('username') username: string): Promise<boolean> {
    return this.userService.removeUser(username);
  }
}
