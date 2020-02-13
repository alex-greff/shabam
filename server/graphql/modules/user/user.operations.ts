<<<<<<< HEAD:server/graphql/modules/user/user.operations.ts
import { Token } from "../../../index";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as Utilities from "../../../utilities";
import KEYS from "../../../keys";
import roles from "../../../roles/roles";
import * as helpers from "./user.helpers";
=======
import { Token } from "../../../types";
import { LoginArgs, SignupArgs, EditUserArgs, EditUserRoleArgs, RemoveUserArgs } from "./user.operations.types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as helpers from "./user.helpers";
import KEYS from "../../../keys";
import roles from "../../../roles/roles";
import * as Utilities from "../../../utilities";
>>>>>>> typescript:server/graphql/modules/user/user.operations.js

// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const Utilities = require("../../../utilities");
// const KEYS = require("../../../keys");
// const roles = require("../../../roles/roles");
// const helpers = require("./user.helpers");

const DEFAULT_ROLE = "default";

<<<<<<< HEAD:server/graphql/modules/user/user.operations.ts
interface UserCredentials {
    email: string;
    password: string;
}

interface LoginArgs {
    credentials: UserCredentials;
}

interface SignupArgs {
    credentials: UserCredentials;
}

interface EditUserArgs {
    email: string;
    updatedCredentials: UserCredentials;
}

interface EditUserRoleArgs {
    email: string;
    updatedRole: string;
}

interface RemoveUserArgs {
    email: string;
}

=======
>>>>>>> typescript:server/graphql/modules/user/user.operations.js
export default {
    login: async (root: any, { credentials }: LoginArgs, context: any): Promise<Token> => {
        const { email, password } = credentials;

        const user = await helpers.getUser(email);

        if (!user) {
<<<<<<< HEAD:server/graphql/modules/user/user.operations.ts
            return Utilities.throwAuthorizationError();
        }

        const passwordHash = user.password;

        const samePassword = bcrypt.compareSync(password, passwordHash);
        // Password comparison failed
        if (!samePassword) {
            return Utilities.throwAuthorizationError();
        }

        const { email: userEmail, role: userRole } = user;
=======
            Utilities.throwAuthorizationError();
        }

        const passwordHash = user!.password;

        const bamePassword = bcrypt.compareSync(password, passwordHash);
        // Password comparison failed
        if (!bamePassword) {
            Utilities.throwAuthorizationError();
        }

        const { email: userEmail, role: userRole } = user!;
>>>>>>> typescript:server/graphql/modules/user/user.operations.js

        // Generate token
        const JWTPayload = {
            email: userEmail,
            role: userRole,
        };
        const JWTOptions = {
            expiresIn: KEYS.JWT_EXPIRE_TIME
        };
<<<<<<< HEAD:server/graphql/modules/user/user.operations.ts
        const token = jwt.sign(oJWTPayload, KEYS.JWT_SECRET, oJWTOptions);
=======
        const token = jwt.sign(JWTPayload, KEYS.JWT_SECRET, JWTOptions);
>>>>>>> typescript:server/graphql/modules/user/user.operations.js

        // Update last login to now
        await helpers.updateLastUserLogin(email);

        // Return the token
        return {
            token: token
        }
    },
    signup: async (root: any, { credentials }: SignupArgs, context: any): Promise<boolean> => {
        const { email, password } = credentials;

        // Attempt to find an already existing user
        const userExists = await helpers.userExists(email);

        if (userExists) {
            // If query doesn't error then the user already exists
            throw new Error(`User '${email}' already exists`);   
        }

        // Hash password
        const passwordHashed = bcrypt.hashSync(password, 10);

        // Create the new user
<<<<<<< HEAD:server/graphql/modules/user/user.operations.ts
        await helpers.createNewUser(email, sPasswordHashed, DEFAULT_ROLE);
=======
        await helpers.createNewUser(email, passwordHashed, DEFAULT_ROLE);
>>>>>>> typescript:server/graphql/modules/user/user.operations.js

        // TODO: remove
        console.log("CREATED USER", {
            email,
            password: passwordHashed,
            role: DEFAULT_ROLE
        });

        return true;
    },
    editUser: async (root: any, { email: currEmail, updatedCredentials }: EditUserArgs, context: any): Promise<boolean> => {
        const { email: newEmail, password: newPassword } = updatedCredentials;

        // Check that the user exists
        const userData = await helpers.getUser(currEmail);

        if (!userData) {
            throw new Error(`User '${currEmail}' does not exist`);
        }

        const { password: sCurrPasswordHash } = userData;

        if (newEmail) {
            if (!Utilities.isEmail(newEmail)) {
                throw new Error(`The email '${newEmail}' is not valid`);
            }

            if (currEmail === newEmail) {
                throw new Error("New email must be different than the current one");
            }

            // Validate that new email is not used anywhere else
            const bEmailInUse = await helpers.userExists(newEmail);

            if (bEmailInUse) {
                throw new Error("Email already in use");
            }
        }

        let newPasswordHash;
        if (newPassword) {
<<<<<<< HEAD:server/graphql/modules/user/user.operations.ts
            let samePassword = bcrypt.compareSync(newPassword, sCurrPasswordHash);
            // Make sure the new password is not the same as the current one
            if (samePassword) {
=======
            let samePass = bcrypt.compareSync(newPassword, sCurrPasswordHash);
            // Make sure the new password is not the same as the current one
            if (samePass) {
>>>>>>> typescript:server/graphql/modules/user/user.operations.js
                throw new Error("New password must be different");
            }

            // Hash password
            newPasswordHash = bcrypt.hashSync(newPassword, 10);
        }

        await helpers.editUser(currEmail, newEmail, newPasswordHash);

        console.log(`UPDATED ACCOUNT '${currEmail}'`, (newEmail) ? `email=${newEmail}` : "", (newPasswordHash) ? `password=${newPasswordHash}` : "");

        return true;
    },
    editUserRole: async (root: any, { email, updatedRole }: EditUserRoleArgs, context: any): Promise<boolean> => {
        // Check that the user exists
        const userExists = await helpers.userExists(email);

        if (!userExists) {
            throw new Error(`User '${email}' does not exist`);
        }

        // Make sure role exists
        if (!roles[updatedRole]) {
            throw new Error(`Role '${updatedRole}' does not exist`);
        }

        // Update the user's role
        await helpers.editUserRole(email, updatedRole);

        console.log(`UPDATED USER ACCOUNT '${email}' TO ROLE '${updatedRole}'`);

        return true;
    },
    removeUser: async (root: any, { email }: RemoveUserArgs, context: any): Promise<boolean> => {
        // Attempt to find an already existing user
        const userExists = helpers.userExists(email);

        if (!userExists) {
            throw new Error(`User '${email}' does not exist`);
        }

        // Delete the user
        await helpers.deleteUser(email);
        
        console.log(`REMOVED USER '${email}'`);

        return true;
    }
}
