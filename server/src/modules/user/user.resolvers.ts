import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import {
  UpdateUserCredentialsInput,
  UserCredentialsInput,
} from './dto/user.inputs';
import {} from './dto/user.args';
import {} from './models/user.models';
import { AuthService } from '../auth/auth.service';
import { GqlLocalAuthGuard } from '../auth/gql-local-auth.guard';

// TODO: implement guards

@Resolver('User')
export class UserResolvers {
  constructor(
    private readonly userService: UserService
  ) {}

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
  async editUser(
    @Args('username') username: string,
    @Args('updatedCredentials',) updatedCredentials: UpdateUserCredentialsInput,
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
