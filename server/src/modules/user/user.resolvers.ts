import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import {
  UpdateUserCredentialsInput,
  UserCredentialsInput,
} from './dto/user.inputs';
import {} from './dto/user.args';
import {} from './models/user.models';

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
    description: 'Login a user, creating a session.',
  })
  async login(
    @Args('credentials') credentials: UserCredentialsInput,
  ): Promise<boolean> {
    return this.userService.login(credentials);
  }

  @Mutation((returns) => Boolean, {
    description: 'Logout the current user, destroying the session.',
  })
  async logout(): Promise<boolean> {
    return this.userService.logout();
  }

  @Mutation((returns) => Boolean, {
    description: 'Signup and create a new user. ',
  })
  async signup(
    @Args('credentials') credentials: UserCredentialsInput,
  ): Promise<boolean> {
    return this.userService.signup(credentials);
  }

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
