import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as Utilities from "../../../utilities";
import KEYS from "../../../keys";
import roles from "../../../roles/roles";
import * as helpers from "./user.helpers";

// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const Utilities = require("../../../utilities");
// const KEYS = require("../../../keys");
// const roles = require("../../../roles/roles");
// const helpers = require("./user.helpers");

const DEFAULT_ROLE = "default";

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

export default {
    login: async (root: any, { credentials }: LoginArgs, context: any) => {
        const { email, password } = credentials;

        const user = await helpers.getUser(email);

        if (!user) {
            return Utilities.throwAuthorizationError();
        }

        const passwordHash = user.password;

        const samePassword = bcrypt.compareSync(password, passwordHash);
        // Password comparison failed
        if (!samePassword) {
            return Utilities.throwAuthorizationError();
        }

        const { email: userEmail, role: userRole } = user;

        // Generate token
        const oJWTPayload = {
            email: userEmail,
            role: userRole,
        };
        const oJWTOptions = {
            expiresIn: KEYS.JWT_EXPIRE_TIME
        };
        const token = jwt.sign(oJWTPayload, KEYS.JWT_SECRET, oJWTOptions);

        // Update last login to now
        await helpers.updateLastUserLogin(email);

        // Return the token
        return {
            token: token
        }
    },
    signup: async (root: any, { credentials }: SignupArgs, context: any) => {
        const { email, password } = credentials;

        // Attempt to find an already existing user
        const userExists = await helpers.userExists(email);

        if (userExists) {
            // If query doesn't error then the user already exists
            throw new Error(`User '${email}' already exists`);   
        }

        // Hash password
        const sPasswordHashed = bcrypt.hashSync(password, 10);

        // Create the new user
        await helpers.createNewUser(email, sPasswordHashed, DEFAULT_ROLE);

        // TODO: remove
        console.log("CREATED USER", {
            email,
            password: sPasswordHashed,
            role: DEFAULT_ROLE
        });

        return true;
    },
    editUser: async (root: any, { email: currEmail, updatedCredentials }: EditUserArgs, context: any) => {
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
            let samePassword = bcrypt.compareSync(newPassword, sCurrPasswordHash);
            // Make sure the new password is not the same as the current one
            if (samePassword) {
                throw new Error("New password must be different");
            }

            // Hash password
            newPasswordHash = bcrypt.hashSync(newPassword, 10);
        }

        await helpers.editUser(currEmail, newEmail, newPasswordHash);

        console.log(`UPDATED ACCOUNT '${currEmail}'`, (newEmail) ? `email=${newEmail}` : "", (newPasswordHash) ? `password=${newPasswordHash}` : "");

        return true;
    },
    editUserRole: async (root: any, { email, updatedRole }: EditUserRoleArgs, context: any) => {
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
    removeUser: async (root: any, { email }: RemoveUserArgs, context: any) => {
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
