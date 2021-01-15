import { CustomRoleCheckFunction, UserRequestData } from "@/types";
import { GqlExecutionContext } from "@nestjs/graphql";
import * as Utilities from "@/utilities";
import { CustomRoleCheck } from "@/roles/roles.types";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { UserService } from "../user.service";

// export const checkUserIsSelf: CustomRoleCheckFunction = async (context, config) => {
//   const ctx = GqlExecutionContext.create(context);
//   const req = ctx.getContext().req;

//   const userData: JWTPayload = req.user;

//   const { usernamePath } = config;


//   return false;
// }

@Injectable()
export class CheckUserIsSelf implements CustomRoleCheck {
  constructor(private userService: UserService) {}

  async passes(context: ExecutionContext) {
    const userData = await this.userService.findUser("test1");
    console.log("CheckUserIsSelf HERE", userData);
    return true;
  }
}