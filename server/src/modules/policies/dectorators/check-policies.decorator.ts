import { CHECK_POLICIES_KEY } from "@/config";
import { SetMetadata } from "@nestjs/common";
import { PolicyHandler } from "../policy.types";

export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);