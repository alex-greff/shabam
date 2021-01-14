import { AppAbility, IPolicyHandler } from "@/modules/policies/policy.types";
import { ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { UserService } from "../user.service";

@Injectable()
export class UserIsSelfPolicy implements IPolicyHandler {
  constructor(private userService: UserService) {}

  async handle(ability: AppAbility, context: ExecutionContext) {
    const userData = await this.userService.findUser("test1");
    console.log("CheckUserIsSelf HERE", userData);
    return true;
  }
}