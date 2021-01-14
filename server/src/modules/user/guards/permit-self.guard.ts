import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UserService } from '../user.service';
import * as Config from '@/config';
import * as Utilities from '@/utilities';
import { Reflector } from '@nestjs/core';
import { JWTPayload, PermissionConfig } from '@/types';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class PermitSelfGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the permissions configuration
    let permissionsConfig = this.reflector.get<PermissionConfig>(
      Config.PERMISSIONS_CONFIG_KEY,
      context.getHandler(),
    );
    permissionsConfig = {
      ...Config.DEFAULT_PERMISSION_CONFIG,
      ...(permissionsConfig ?? {}),
    };

    const ctx = GqlExecutionContext.create(context);
    const args = ctx.getArgs();
    const req = ctx.getContext().req;

    const userData: JWTPayload = req.user;

    // Block passthrough if the user is not authenticated
    if (!userData) return false;

    const targetUsername = Utilities.getIn(
      args,
      permissionsConfig.usernamePath,
    );

    // Compare the target username with the username of the
    // currently authenticated user
    return targetUsername === userData.username;
  }
}
