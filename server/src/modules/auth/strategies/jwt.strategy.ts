import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import KEYS from "@/keys";
import { JWTPayload } from '@/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: KEYS.JWT_SECRET,
    });
  }

  async validate(payload: JWTPayload) {
    return { username: payload.username, role: payload.role };
  }
}