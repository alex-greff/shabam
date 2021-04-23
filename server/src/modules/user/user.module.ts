import { UserAccountEntity } from '@/entities/UserAccount.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Global, Module } from '@nestjs/common';
import { UserResolvers } from './user.resolvers';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [ 
    MikroOrmModule.forFeature([UserAccountEntity])
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