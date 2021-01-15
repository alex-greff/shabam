import { UserAccountEntity } from "@/entities/UserAccount.entity";
import { Action, AppAbility, IPolicyHandler } from "@/modules/policies/policy.types";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { UserService } from "../user.service";

@Injectable()
export class UserEditRolePolicy implements IPolicyHandler {
  constructor(private userService: UserService) {}

  async handle(ability: AppAbility, context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    const targetUsername = ctx.getArgs().username;
    if (!targetUsername)
      return false;

    const targetUser = await this.userService.findUser(targetUsername);

    if (!targetUser) 
      return false;

    const result = ability.can(Action.Update, UserAccountEntity, 'role');

    return result;
  }
}