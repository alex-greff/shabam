import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserResolvers } from './user.resolvers';
import { UserService } from './user.service';

import { UserAccountEntity } from "@/entities/UserAccount.entity";

@Module({
  imports: [ 
    TypeOrmModule.forFeature([UserAccountEntity])
  ],
  providers: [
    UserService, 
    UserResolvers
  ],
  exports: [
    UserService
  ]
})
export class UserModule {}