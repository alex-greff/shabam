import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { } from './dto/auth.inputs';
import { } from './dto/auth.args';
import { AccessCredentials } from './models/auth.models';
import { GqlLocalAuthGuard } from './guards/gql-local-auth.guard';
import { UserDataInput } from '../user/dto/user.inputs';
import { User } from '../user/models/user.models';

@Resolver('Auth')
export class AuthResolvers {
  constructor(
    private readonly authService: AuthService
  ) {}

  // -----------------
  // --- Mutations ---
  // -----------------

  @Mutation((returns) => AccessCredentials, {
    description: 'Login a user, creating a session.',
  })
  @UseGuards(GqlLocalAuthGuard)
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
  ): Promise<AccessCredentials> {
    return this.authService.login(username);
  }

  @Mutation((returns) => Boolean, {
    description: 'Logout the current user, destroying the session.',
  })
  async logout(): Promise<boolean> {
    return this.authService.logout();
  }

  @Mutation((returns) => AccessCredentials, {
    description: 'Signup and create a new user. ',
  })
  async signup(
    @Args('userData') userData: UserDataInput,
  ): Promise<AccessCredentials> {
    return this.authService.signup(userData);
  }
}