import { SetMetadata } from "@nestjs/common";
import { CHECK_POLICIES_KEY } from "@/config";
import { PolicyHandler } from "../policy.types";

export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);