import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import {
  UpdateUserCredentialsInput,
  UserCredentialsInput,
} from './dto/user.inputs';
import {} from './dto/user.args';
import { UserAccountEntity } from '@/entities/UserAccount.entity';

// TODO: implement

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserAccountEntity)
    private userRepository: Repository<UserAccountEntity>
  ) {}

  async checkUsernameAvailability(username: string): Promise<boolean> {
    return true;
  }

  async findUser(username: string): Promise<UserAccountEntity> {
    const user = await this.userRepository.findOne({ username });
    return user;
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
