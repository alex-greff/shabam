const roles = require("./roles");
const CUSTOM_ROLE_CHECK_MAP = require("./custom-role-checks");
const Utilities = require("../utilities");

// Inject prototype addons
require("../utilities/prototypeAddons");

module.exports = (root, args, context) => {
    return async (config, role, ...operations) => {
        // Function checking if the permissions are allowed
        const canDoOperation = async (role, operation) => {
            // Check if role exists
            if (!roles[role]){
                return false;
            }
    
            let $role = roles[role];
    
            // Check if this operation has role access
            if($role.can.indexOf(operation) !== -1) {
                // Check for any custom role checks and run if found
                const customRoleCheck = CUSTOM_ROLE_CHECK_MAP[operation];
                if (customRoleCheck) {
                    return await customRoleCheck(root, args, context, config);
                }

                // If no custom role checks then pass the check
                return true;
            }
    
            // Check if there are any parents
            if (!$role.inherits || $role.inherits.length <= 0) {
                return false;
            }
    
            // Check if at least one of the inherited roles can do the operation
            // Note: this code acts like Array.some but with async code
            const inheritChecks = $role.inherits.map(inheritedRole => {
                return () => Utilities.booleanResolver(canDoOperation, inheritedRole, operation);
            });
            return await Utilities.resolveAsBoolean(() => Promise.some(inheritChecks));
        };

        // Check if at least one of the operations is in the role
        // Note: this code acts like Array.some but with async code
        const operationChecks = operations.map(operation => {
            return () => Utilities.booleanResolver(canDoOperation, role, operation);
        });
        return await Utilities.resolveAsBoolean(() => Promise.some(operationChecks)); 
    };
};