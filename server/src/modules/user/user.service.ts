import { Injectable } from '@nestjs/common';
import {
  UpdateUserCredentialsInput,
  UserCredentialsInput,
} from './dto/user.inputs';
import {} from './dto/user.args';
import {} from './models/user.models';

// TODO: implement

@Injectable()
export class UserService {
  async checkUsernameAvailability(username: string): Promise<boolean> {
    return true;
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

  async editUser(
    username: string,
    updatedCredentials: UpdateUserCredentialsInput,
  ): Promise<boolean> {
    return true;
  }

  async editUserRole(username: string, updatedRole: string): Promise<boolean> {
    return true;
  }

  async removeUser(username: string): Promise<boolean> {
    return true;
  }
}
