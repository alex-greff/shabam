import { ModuleRef, Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Type,
} from '@nestjs/common';
import { CHECK_POLICIES_KEY } from '@/config';
import { PoliciesAbilityFactory } from '../factories/policies-ability.factory';
import {
  AppAbility,
  IPolicyHandler,
  PolicyHandler,
  PolicyHandlerCallback,
} from '../policy.types';
import * as Utilities from '@/utilities';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRequestData } from '@/types';
import { UserService } from '@/modules/user/user.service';
import { UserAccountEntity } from '@/entities/UserAccount.entity';

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
    const userData: UserRequestData = req.user;

    const user = await this.userService.findUser(userData.username);
    if (!user) return false;

    const ability = this.policiesAbilityFactory.createForUser(user);

    // Execute each policy handler and make sure all pass
    for (const handler of policyHandlers) {
      const result = await this.execPolicyHandler(context, handler, ability, user);
      if (!result) return false;
    }

    return true;
  }

  private async execPolicyHandler(
    context: ExecutionContext,
    policyHandler: PolicyHandler,
    ability: AppAbility,
    user: UserAccountEntity
  ) {
    // Passed in a class that implements IPolicyHandler
    if (Utilities.isClass(policyHandler)) {
      const handler = policyHandler as Type<IPolicyHandler>;
      const handlerInstance = await this.moduleRef.create(handler);
      return handlerInstance.handle(ability, user, context);
    }

    // Passed in a PolicyHandlerCallback
    if (Utilities.isFunction(policyHandler)) {
      const handler = policyHandler as PolicyHandlerCallback;
      return handler(ability, user, context);
    }

    // Passed in an instance of IPolicyHandler
    const handler = policyHandler as IPolicyHandler;
    return handler.handle(ability, user, context);
  }
}
