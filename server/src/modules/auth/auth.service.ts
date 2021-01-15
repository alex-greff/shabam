import { Injectable, NotImplementedException } from '@nestjs/common';
import { UserRequestData } from '@/types';
import { JwtService } from '@nestjs/jwt';
import bcrypt from "bcrypt";
import { UserService } from '@/modules/user/user.service';
import { UserDataInput } from '../user/dto/user.inputs';
import { AccessCredentials } from './models/auth.models';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findUser(username);

    if (user && bcrypt.compareSync(password, user.password)) {
      // Strip out password hash
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(username: string): Promise<AccessCredentials> {
    const user = await this.userService.findUser(username);

    const payload: UserRequestData = {
      username,
      role: user.role
    };

    await this.userService.updateLastLogin(username);

    return {
      access_token: this.jwtService.sign(payload)
    };
  }

  async signup(userData: UserDataInput): Promise<AccessCredentials> {
    await this.userService.createUser(userData);

    return this.login(userData.username);
  }

  async logout(): Promise<boolean> {
    // TODO: this is unused right now since JWT is used
    throw new NotImplementedException();
  }
}