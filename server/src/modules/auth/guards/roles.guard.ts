import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ModuleRef, Reflector } from '@nestjs/core';
import * as Config from '@/config';
import { JWTPayload, PermissionConfig } from '@/types';
import { canDoSomePermissions } from '@/roles';
import { CheckUserIsSelf } from '@/modules/user/role-checks/user.role-checks';

// Reference: https://docs.nestjs.com/guards#role-based-authentication

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private moduleRef: ModuleRef
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get<string[]>(
      Config.PERMISSIONS_METADATA_KEY,
      context.getHandler(),
    );

    // Passthrough if we do not have any operations
    // defined on this resolver/endpoint
    if (!permissions) return true;

    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    const userData: JWTPayload = req.user;

    // const test = await this.moduleRef.create(CheckUserIsSelf);
    // const msg = await test.passes(context);

    // Block passthrough if the user is not authenticated
    if (!userData) return false;

    // Check if the currently authenticated user can do some of the 
    // permissions as required by the guard config
    return true;
    // return canDoSomePermissions(userData.role, ...permissions);
  }
}
