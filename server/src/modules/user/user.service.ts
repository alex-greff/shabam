import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { UpdateUserCredentialsInput, UserDataInput } from './dto/user.inputs';
import {} from './dto/user.args';
import { UserAccountEntity } from '@/entities/UserAccount.entity';
import { UserRoles } from '@/modules/policies/policy.types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserAccountEntity)
    private userRepository: Repository<UserAccountEntity>,
  ) {}

  /** Finds a user entity with the given name. Returns null otherwise. */
  async findUser(username: string): Promise<UserAccountEntity | null> {
    const user = await this.userRepository.findOne({ username });
    return user;
  }

  /**
   * Returns true if the given username is available.
   */
  async checkUsernameAvailability(username: string): Promise<boolean> {
    return (await this.findUser(username)) == null;
  }

  /**
   * Updates the last login of the user to now.
   */
  async updateLastLogin(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ username });
    if (!user) return false;
    user.lastLogin = new Date();
    await this.userRepository.save(user);
    return true;
  }

  async createUser(userData: UserDataInput): Promise<UserAccountEntity> {
    // Ensure that the username is not taken already
    const usernameAvailable = await this.checkUsernameAvailability(
      userData.username,
    );
    if (!usernameAvailable) throw new ConflictException();

    const newUser = await this.userRepository.create({
      username: userData.username,
      password: bcrypt.hashSync(userData.password, 10),
      role: UserRoles.Default,
      signupDate: new Date(),
    });
    await this.userRepository.save(newUser);

    return newUser;
  }

  async editUser(
    username: string,
    updatedCredentials: UpdateUserCredentialsInput,
  ): Promise<boolean> {
    const user = await this.findUser(username);
    if (!user)
      throw new NotFoundException();

    let numFieldsUpdated = 0;
    
    const newUsername = updatedCredentials.username as string | null;
    if (newUsername) {
      const available = await this.checkUsernameAvailability(newUsername);
      if (!available)
        throw new ConflictException();
      
      user.username = newUsername;

      numFieldsUpdated++;
    }

    const newPassword = updatedCredentials.password as string | null;
    if (newPassword) {
      user.password = bcrypt.hashSync(newPassword, 10);

      numFieldsUpdated++;
    }

    if (numFieldsUpdated < 1)
      return false;

    await this.userRepository.save(user);

    return true;
  }

  async editUserRole(username: string, updatedRole: string): Promise<boolean> {
    // TODO: implement
    return true;
  }

  async removeUser(username: string): Promise<boolean> {
    // TODO: implement
    return true;
  }
}
