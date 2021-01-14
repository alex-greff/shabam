import { APP_GUARD } from "@nestjs/core";
import { Global, Module } from '@nestjs/common';
import { PassportModule } from "@nestjs/passport";
import KEYS from "@/keys";
import { JwtModule } from '@nestjs/jwt';
import { JWT_EXPIRE_TIME } from '@/config';

import { AuthService } from './auth.service';
import { UserModule } from "@/modules/user/user.module";
import { AuthResolvers } from './auth.resolvers';

import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

@Global()
@Module({
  imports: [ 
    // FYI: To stop circular dependencies (in case I need it later)
    // https://stackoverflow.com/questions/63572923/nest-cant-resolve-dependencies-of-authservice
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: KEYS.JWT_SECRET,
      signOptions: {
        expiresIn: JWT_EXPIRE_TIME
      }
    })
  ],
  providers: [
    AuthService, 
    AuthResolvers, 
    JwtStrategy,
    LocalStrategy,
  ],
})
export class AuthModule {}