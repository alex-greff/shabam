import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserResolvers } from './user.resolvers';
import { UserService } from './user.service';

import { AuthModule } from "@/modules/auth/auth.module";
import { UserAccountEntity } from "@/entities/UserAccount.entity";
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([UserAccountEntity])
  ],
  providers: [
    UserService, 
    AuthService,
    UserResolvers
  ],
  exports: [
    UserService
  ]
})
export class UserModule {}