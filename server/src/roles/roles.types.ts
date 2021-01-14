import { ExecutionContext, Type } from "@nestjs/common";

export interface CustomRoleCheck {
  passes(context: ExecutionContext): boolean | Promise<boolean>;
}

export interface CustomRoleCheckMappings {
  [role: string]: Type<CustomRoleCheck>;
}