import { DEFAULT_ROLE, SESSION_EXPIRE_LENGTH, USERNAME_COOKIE_NAME } from "@/constants";
import { AppContext } from "@/types";
import { 
    LoginArgs, 
    CheckUsernameAvailabilityArgs, 
    SignupArgs, 
    EditUserArgs, 
    EditUserRoleArgs, 
    RemoveUserArgs } from "./user.operations.types";
import bcrypt from "bcryptjs";
import * as helpers from "./user.helpers";
import KEYS from "@/keys";
import roles from "@/roles/roles";
import * as Utilities from "@/utilities";
import * as Error from "@/error";
import cookie from "cookie";


export default {
    login: async (root: any, { credentials }: LoginArgs, context: AppContext): Promise<boolean> => {
        const { username, password } = credentials;

        const user = await helpers.getUser(username);

        if (!user) {
            Error.throwAuthenticationError();
        }

        const passwordHash = user!.password;

        const samePassword = bcrypt.compareSync(password, passwordHash);
        // Password comparison failed
        if (!samePassword) {
            Error.throwAuthenticationError();
        }

        const { username: userUsername, role: userRole } = user!;

        // No session exists
        if (!context.req.session) {
            Error.throwServerError();
        }

        // Regenerate the session
        const regenerate = () => new Promise((resolve, reject) => {
            context.req.session!.regenerate((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        // Regenerate the session for the user
        try {
            await regenerate();
        } catch(err) {
            Error.throwServerError();
        }

        // Update the session metadata
        context.req.session!.userData = {
            username: userUsername,
            role: userRole
        };

        // Set the username cookie 
        context.res.setHeader("Set-Cookie", cookie.serialize(USERNAME_COOKIE_NAME, userUsername, {
            path: "/",
            expires: new Date(Date.now() + SESSION_EXPIRE_LENGTH),
            httpOnly: false,
            secure: (KEYS.PRODUCTION) ? true : false,
            sameSite: false
        }));

        // Update last login to now
        await helpers.updateLastUserLogin(username);

        return true;
    },
    logout: async (root: any, args: any, context: AppContext): Promise<boolean> => {
        // No active session
        if (!context.req.session?.userData) {
            return false;
        }

        // Destroy the session
        const destroy = () => new Promise((resolve, reject) => {
            context.req.session!.destroy((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        });

        context.req.session.userData = undefined;

        try {
            await destroy();
        } catch(err) {
            Error.throwServerError();
        }

        // Unset the username cookie 
        context.res.setHeader("Set-Cookie", cookie.serialize(USERNAME_COOKIE_NAME, '', {
            path: "/",
            maxAge: -1,
            httpOnly: false,
            secure: (KEYS.PRODUCTION) ? true : false,
            sameSite: false
        }));

        return true;
    },
    checkAvailability: async (root: any, { username }: CheckUsernameAvailabilityArgs, context: AppContext): Promise<boolean> => {
        // See if the user already exists
        const userExists = await helpers.userExists(username);
        return !userExists;
    },
    signup: async (root: any, { credentials }: SignupArgs, context: AppContext): Promise<boolean> => {
        const { username, password } = credentials;

        // Attempt to find an already existing user
        const userExists = await helpers.userExists(username);

        if (userExists) {
            // If query doesn't error then the user already exists
            return Error.throwUsernameAlreadyExistsError(username);
        }

        // Hash password
        const passwordHashed = bcrypt.hashSync(password, 10);

        // Create the new user
        await helpers.createNewUser(username, passwordHashed, DEFAULT_ROLE);

        console.log("CREATED USER", {
            username,
            password: passwordHashed,
            role: DEFAULT_ROLE
        });

        return true;
    },
    editUser: async (root: any, { username: currUsername, updatedCredentials }: EditUserArgs, context: AppContext): Promise<boolean> => {
        const { username: newUsername, password: newPassword } = updatedCredentials;

        // Check that the user exists
        const userData = await helpers.getUser(currUsername);

        if (!userData) {
            return Error.throwUsernameNotExistsError(currUsername);
        }

        const { password: sCurrPasswordHash } = userData;

        if (newUsername) {
            if (!Utilities.isUsername(newUsername)) {
                Error.throwUsernameInvalidError(newUsername);
            }

            if (currUsername === newUsername) {
                return Error.throwUsernameTheSameError();
            }

            // Validate that new newUsername is not used anywhere else
            const usernameInUse = await helpers.userExists(newUsername);

            if (usernameInUse) {
                return Error.throwUsernameAlreadyExistsError(newUsername);
            }
        }

        let newPasswordHash;
        if (newPassword) {
            let samePass = bcrypt.compareSync(newPassword, sCurrPasswordHash);
            // Make sure the new password is not the same as the current one
            if (samePass) {
                return Error.throwPasswordTheSameError();
            }

            // Hash password
            newPasswordHash = bcrypt.hashSync(newPassword, 10);
        }

        await helpers.editUser(currUsername, newUsername, newPasswordHash);

        console.log(`UPDATED ACCOUNT '${currUsername}'`, (newUsername) ? `username=${newUsername}` : "", (newPasswordHash) ? `password=${newPasswordHash}` : "");

        return true;
    },
    editUserRole: async (root: any, { username, updatedRole }: EditUserRoleArgs, context: any): Promise<boolean> => {
        // Check that the user exists
        const userExists = await helpers.userExists(username);

        if (!userExists) {
            Error.throwUsernameNotExistsError(username);
        }

        // Make sure role exists
        if (!roles[updatedRole]) {
            return Error.throwRoleNotExistsError(updatedRole);
        }

        // Update the user's role
        await helpers.editUserRole(username, updatedRole);

        console.log(`UPDATED USER ACCOUNT '${username}' TO ROLE '${updatedRole}'`);

        return true;
    },
    removeUser: async (root: any, { username }: RemoveUserArgs, context: AppContext): Promise<boolean> => {
        // Attempt to find an already existing user
        const userExists = helpers.userExists(username);

        if (!userExists) {
            Error.throwUsernameNotExistsError(username);
        }

        // Delete the user
        await helpers.deleteUser(username);
        
        console.log(`REMOVED USER '${username}'`);

        return true;
    }
}
