const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Utilities = require("../../../utilities");
const KEYS = require("../../../keys");
const roles = require("../../../roles/roles");
const helpers = require("./user.helpers");

const DEFAULT_ROLE = "default";

module.exports = {
    login: async (root, { credentials }, context) => {
        const { email, password } = credentials;

        const oUser = await helpers.getUser(email);

        if (!oUser) {
            Utilities.throwAuthorizationError();
        }

        const sPasswordHash = oUser.password;

        const bSamePassword = bcrypt.compareSync(password, sPasswordHash);
        // Password comparison failed
        if (!bSamePassword) {
            Utilities.throwAuthorizationError();
        }

        const { email: userEmail, role: userRole } = oUser;

        // Generate token
        const oJWTPayload = {
            email: userEmail,
            role: userRole,
        };
        const oJWTOptions = {
            expiresIn: KEYS.JWT_EXPIRE_TIME
        };
        const sToken = jwt.sign(oJWTPayload, KEYS.JWT_SECRET, oJWTOptions);

        // Update last login to now
        await helpers.updateLastUserLogin(email);

        // Return the token
        return {
            token: sToken
        }
    },
    signup: async (root, { credentials }, context) => {
        const { email, password } = credentials;

        // Attempt to find an already existing user
        const bUserExists = await helpers.userExists(email);

        if (bUserExists) {
            // If query doesn't error then the user already exists
            throw new Error(`User '${email}' already exists`);   
        }

        // Hash password
        const sPasswordHashed = bcrypt.hashSync(password, 10);

        // Create the new user
        await helpers.createNewUser(email, sPasswordHashed, role);

        console.log("CREATED USER", {
            email,
            password: sPasswordHashed,
            role: DEFAULT_ROLE
        });

        return true;
    },
    editUser: async (root, { email: currEmail, updatedCredentials }, context) => {
        const { email: newEmail, password: newPassword } = updatedCredentials;

        // Check that the user exists
        const oUserData = await helpers.getUser(currEmail);

        if (!oUserData) {
            throw new Error(`User '${currEmail}' does not exist`);
        }

        const { password: sCurrPasswordHash } = oUserData;

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
            let bSamePass = bcrypt.compareSync(newPassword, sCurrPasswordHash);
            // Make sure the new password is not the same as the current one
            if (bSamePass) {
                throw new Error("New password must be different");
            }

            // Hash password
            newPasswordHash = bcrypt.hashSync(newPassword, 10);
        }

        await helpers.editUser(currEmail, newEmail, newPasswordHash);

        console.log(`UPDATED ACCOUNT '${currEmail}'`, (newEmail) ? `email=${newEmail}` : "", (newPasswordHash) ? `password=${newPasswordHash}` : "");

        return true;
    },
    editUserRole: async (root, { email, updatedRole }, context) => {
        // Check that the user exists
        const bUserExists = await helpers.userExists(email);

        if (!bUserExists) {
            throw new Error(`User '${currEmail}' does not exist`);
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
    removeUser: async (root, { email }, context) => {
        // Attempt to find an already existing user
        const bUserExists = helpers.userExists(email);

        if (!bUserExists) {
            throw new Error(`User '${email}' does not exist`);
        }

        // Delete the user
        await helpers.deleteUser(email);
        
        console.log(`REMOVED USER '${email}'`);

        return true;
    }
}
