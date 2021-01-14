import { ModuleRef, Reflector } from "@nestjs/core";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { CHECK_POLICIES_KEY } from "@/config";
import { PoliciesAbilityFactory } from "../factories/policies-ability.factory";
import { AppAbility, PolicyHandler } from "../policy.types";
import * as Utilities from "@/utilities";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JWTPayload } from "@/types";
import { UserService } from "@/modules/user/user.service";
import { CustomRoleCheck } from "@/roles/roles.types";

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private moduleRef: ModuleRef,
    private userService: UserService,
    private policiesAbilityFactory: PoliciesAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];

    // Passthrough if we do not have any policy handlers
    // defined on this resolver/endpoint
    if (!policyHandlers) return true;

    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    const userData: JWTPayload = req.user;

    const user = await this.userService.findUser(userData.username);

    const ability = this.policiesAbilityFactory.createForUser(user);

    // Execute each policy handler and make sure all pass
    for (const handler of policyHandlers) {
      const result = await this.execPolicyHandler(context, handler, ability);
      if (!result)
        return false;
    }

    return true;
  }

  private async execPolicyHandler(context: ExecutionContext, handler: PolicyHandler, ability: AppAbility) {
    // Passed in a class that implements IPolicyHandler
    if (Utilities.isClass(handler)) {
      console.log("CLASS");
      // @ts-expect-error
      const handlerInstance = await this.moduleRef.create(handler);    
      return handlerInstance.handle(ability, context);
    }

    // Passed in a PolicyHandlerCallback 
    if (Utilities.isFunction(handler)) {
      console.log("FUNCTION");
      // @ts-expect-error
      return handler(handler, context);
    }

    // Passed in an instance of IPolicyHandler
    console.log("INSTANCE");
    // @ts-expect-error
    return handler.handle(ability, context);
  }
}