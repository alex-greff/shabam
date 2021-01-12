import { Injectable } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { UserCredentialsInput } from '../user/dto/user.inputs';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findUser(username);

    // TODO: compare passwords with bcrypt
    if (user && user.password === password) {
      // Strip out password hash
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(credentials: UserCredentialsInput): Promise<boolean> {
    return true;
  }

  async logout(): Promise<boolean> {
    return true;
  }

  async signup(credentials: UserCredentialsInput): Promise<boolean> {
    return true;
  }
}