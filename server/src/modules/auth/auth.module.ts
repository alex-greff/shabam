import { Module } from '@nestjs/common';
import { PassportModule } from "@nestjs/passport";
import { AuthService } from './auth.service';
import { LocalStrategy } from "./local.strategy";

import { UserModule } from "@/modules/user/user.module";
import { AuthResolvers } from './auth.resolvers';

@Module({
  imports: [ 
    // FYI: To stop circular dependencies (in case I need it later)
    // https://stackoverflow.com/questions/63572923/nest-cant-resolve-dependencies-of-authservice
    UserModule,
    PassportModule 
  ],
  providers: [ AuthService, AuthResolvers, LocalStrategy ],
})
export class AuthModule {}