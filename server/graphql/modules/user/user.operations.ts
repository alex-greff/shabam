import { AppContext } from "@/types";
import { Token } from "@/types/schema";
import { promisify } from "es6-promisify";
import { LoginArgs, SignupArgs, EditUserArgs, EditUserRoleArgs, RemoveUserArgs } from "./user.operations.types";
import bcrypt from "bcryptjs";
import * as helpers from "./user.helpers";
import KEYS from "@/keys";
import roles from "@/roles/roles";
import * as Utilities from "@/utilities";

const DEFAULT_ROLE = "default";

export default {
    login: async (root: any, { credentials }: LoginArgs, context: AppContext): Promise<boolean> => {
        const { email, password } = credentials;

        const user = await helpers.getUser(email);

        if (!user) {
            Utilities.throwAuthorizationError();
        }

        const passwordHash = user!.password;

        const samePassword = bcrypt.compareSync(password, passwordHash);
        // Password comparison failed
        if (!samePassword) {
            Utilities.throwAuthorizationError();
        }

        const { email: userEmail, role: userRole } = user!;

        // No session exists
        if (!context.req.session) {
            throw new Error(`An error occurred on the server`);
        }

        // Regenerate the session
        const regenerate = promisify(context.req.session!.regenerate);

        // Update the session metadata
        context.req.session!.userData = {
            email: userEmail,
            role: userRole
        };

        // Regenerate the session for the user
        try {
            await regenerate();
        } catch(err) {
            throw new Error(`An error occurred on the server`);
        }

        // Update last login to now
        await helpers.updateLastUserLogin(email);

        return true;
    },
    signup: async (root: any, { credentials }: SignupArgs, context: AppContext): Promise<boolean> => {
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
        await helpers.createNewUser(email, passwordHashed, DEFAULT_ROLE);

        console.log("CREATED USER", {
            email,
            password: passwordHashed,
            role: DEFAULT_ROLE
        });

        return true;
    },
    editUser: async (root: any, { email: currEmail, updatedCredentials }: EditUserArgs, context: AppContext): Promise<boolean> => {
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
            const emailInUse = await helpers.userExists(newEmail);

            if (emailInUse) {
                throw new Error("Email already in use");
            }
        }

        let newPasswordHash;
        if (newPassword) {
            let samePass = bcrypt.compareSync(newPassword, sCurrPasswordHash);
            // Make sure the new password is not the same as the current one
            if (samePass) {
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
    removeUser: async (root: any, { email }: RemoveUserArgs, context: AppContext): Promise<boolean> => {
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
