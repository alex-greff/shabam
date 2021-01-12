import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";

import { AuthService } from "@/modules/auth/auth.service";

@Injectable()
// export class LocalStrategy extends PassportStrategy(GraphQLLocalStrategy) {
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validateUser(username, password);
    console.log("HERE", username, password, user);
    if (!user)
      throw new UnauthorizedException();
    return user;
  }
}
