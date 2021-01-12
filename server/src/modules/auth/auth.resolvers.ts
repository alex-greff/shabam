import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { } from './dto/auth.inputs';
import { } from './dto/auth.args';
import { } from './models/auth.models';
import { GqlLocalAuthGuard } from './gql-local-auth.guard';
import { UserCredentialsInput } from '../user/dto/user.inputs';

@Resolver('Auth')
export class AuthResolvers {
  constructor(private readonly authService: AuthService) {}

  // -----------------
  // --- Mutations ---
  // -----------------

  @Mutation((returns) => Boolean, {
    description: 'Login a user, creating a session.',
  })
  @UseGuards(GqlLocalAuthGuard)
  async login(
    @Args('username') username: string,
    @Args('password') password: string
  ): Promise<boolean> {
    // TODO: setup session and whatnot since the guard passed
    // return this.authService.login(credentials);
    return true;
  }

  @Mutation((returns) => Boolean, {
    description: 'Logout the current user, destroying the session.',
  })
  async logout(): Promise<boolean> {
    return this.authService.logout();
  }

  @Mutation((returns) => Boolean, {
    description: 'Signup and create a new user. ',
  })
  async signup(
    @Args('credentials') credentials: UserCredentialsInput,
  ): Promise<boolean> {
    return this.authService.signup(credentials);
  }

}