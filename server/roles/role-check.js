const roles = require("./roles");

module.exports = (role, ...operations) => {
    // Function checking if the permissions are allowed
    const canDoOperation = (role, operation) => {
        // Check if role exists
        if (!roles[role]){
            return false;
        }

        let $role = roles[role];

        // Check if this role has access
        if($role.can.indexOf(operation) !== -1) {
            return true;
        }

        // Check if there are any parents
        if (!$role.inherits || $role.inherits.length <= 0) {
            return false;
        }

        // Check if at least one of the child roles can do the operation
        return $role.inherits.some(childRole => canDoOperation(childRole, operation));
    };

    return operations.every(operation => canDoOperation(role, operation));
}