import { AppContext, RoleCheckConfig } from "@/types";
import canDoAllOperations from "@/roles/role-check";
import * as Utilities from "@/utilities";

const DEFAULT_CHECK_CONFIG: RoleCheckConfig = {
    userUsernamePath: "username"
};

export default (config: Partial<RoleCheckConfig>, ...operations: string[]) => {
    return async (root: any, args: any, context: AppContext) => {
        try {
            config = (config) ? { ...DEFAULT_CHECK_CONFIG, ...config } : { ...DEFAULT_CHECK_CONFIG } as RoleCheckConfig;

            // Check if there user data provided
            if (!context.req.session || !context.req.session.userData) {
                Utilities.throwAuthorizationError();
            }

            const { role } = context.req.session!.userData!;

            // Check if user has access
            if (!(await canDoAllOperations(root, args, context)(config as RoleCheckConfig, role, ...operations))) {
                Utilities.throwAuthorizationError();
            }
        } catch (error) {
            Utilities.throwAuthorizationError();
        }
    }
}