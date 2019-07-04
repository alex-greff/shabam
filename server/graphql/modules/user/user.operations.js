const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Utilities = require("../../../utilities");
const db = require("../../../db");
const KEYS = require("../../../keys");
const roles = require("../../../roles/roles");

const DEFAULT_ROLE = "default";

module.exports = {
    login: async (root, { credentials }, context) => {
        const { email, password } = credentials;

        const getUserQuery = await db.query("SELECT email, password FROM user_account AS ua WHERE ua.email = %L", email);
        const bUserFound = getUserQuery.rowCount > 0;

        if (!bUserFound) {
            Utilities.throwAuthorizationError();
        }

        const sPasswordHash = getUserQuery.rows[0].password;

        const bSamePassword = bcrypt.compareSync(password, sPasswordHash);
        // Password comparison failed
        if (!bSamePassword) {
            Utilities.throwAuthorizationError();
        }

        const { email: userEmail } = getUserQuery.rows[0];

        // Generate token
        const oJWTPayload = {
            email: userEmail,
        };
        const oJWTOptions = {
            expiresIn: KEYS.jwtExpireTime
        };
        const sToken = jwt.sign(oJWTPayload, KEYS.jwtSecret, oJWTOptions);

        // Update last login
        const sLastLoginTimestamp = `to_timestamp(${Date.now()} / 1000.0)`;
        await db.query(`UPDATE user_account AS ua SET last_login = %s WHERE ua.email = %L`, sLastLoginTimestamp, email);

        // Return the token
        return {
            token: sToken
        }
    },
    signup: async (root, { credentials }, context) => {
        const { email, password } = credentials;

        // Attempt to find an already existing user
        const checkUserQuery = await db.query("SELECT email FROM user_account AS ua WHERE ua.email = %L", email);
        const bUserExists = checkUserQuery.rowCount > 0;

        if (bUserExists) {
            // If query doesn't error then the user already exists
            throw new Error(`User '${email}' already exists`);   
        }

        // Hash password
        const sPasswordHashed = bcrypt.hashSync(password, 10);
        
        const oNewUser = {
            email: email,
            password: sPasswordHashed,
            role: DEFAULT_ROLE,
            signup_date: `to_timestamp(${Date.now()} / 1000.0)`
        };

        const sNewUserKeys = Object.keys(oNewUser);
        const sNewUserValues = Object.values(oNewUser);

        // Create the new user
        await db.query('INSERT INTO user_account(%I, %I, %I, %I) VALUES (%L, %L, %L, %s)', ...sNewUserKeys, ...sNewUserValues);    

        console.log("CREATED USER", oNewUser);

        return true;
    },
    editUser: async (root, { email: currEmail, updatedCredentials }, context) => {
        const { email: newEmail, password: newPassword } = updatedCredentials;

        // Check that the user exists
        const getUserQuery = await db.query("SELECT password FROM user_account AS ua WHERE ua.email = %L", currEmail);
        const bUserExists = getUserQuery.rowCount > 0;

        if (!bUserExists) {
            throw new Error(`User '${currEmail}' does not exist`);
        }

        const { password: sCurrPasswordHash } = getUserQuery.rows[0];

        const aUpdatedUserData = []; // Fromat: [ [identifier, value] ]

        if (newEmail) {
            if (!Utilities.isEmail(newEmail)) {
                throw new Error(`The email '${newEmail}' is not valid`);
            }

            if (currEmail === newEmail) {
                throw new Error("New email must be different than the current one");
            }

            // Validate that new email is not used anywhere else
            const emailInUseQuery = await db.query("SELECT email FROM user_account AS ua WHERE ua.email = %L", newEmail);
            const bEmailInUse = emailInUseQuery.rowCount > 0;

            if (bEmailInUse) {
                throw new Error("Email already in use");
            }

            aUpdatedUserData.push(["email", newEmail]);
        }

        if (newPassword) {
            let bSamePass = bcrypt.compareSync(newPassword, sCurrPasswordHash);
            // Make sure the new password is not the same as the current one
            if (bSamePass) {
                throw new Error("New password must be different");
            }

            // Hash password
            const sNewPasswordHash = bcrypt.hashSync(newPassword, 10);

            aUpdatedUserData.push(["password", sNewPasswordHash]);
        }

        // Update the user
        const aSetFormat = aUpdatedUserData.map(aVal => "%I = %L");
        const sSetFormat = aSetFormat.join(", ");
        const aSetValues = aUpdatedUserData.reduce((acc, i_aCurrVal) => [...acc, i_aCurrVal[0], i_aCurrVal[1]], []);

        await db.query(`UPDATE user_account AS ua SET ${sSetFormat} WHERE ua.email = %L`, ...aSetValues, currEmail);

        console.log(`UPDATED ACCOUNT '${currEmail}' ${aSetValues}`)

        return true;
    },
    editUserRole: async (root, { email, updatedRole }, context) => {
        // Check that the user exists
        const getUserQuery = await db.query("SELECT password FROM user_account AS ua WHERE ua.email = %L", email);
        const bUserExists = getUserQuery.rowCount > 0;

        if (!bUserExists) {
            throw new Error(`User '${currEmail}' does not exist`);
        }

        // Make sure role exists
        if (!roles[updatedRole]) {
            throw new Error(`Role '${updatedRole}' does not exist`);
        }

        // Update the user's role
        await db.query(`UPDATE user_account AS ua SET role = %L WHERE ua.email = %L`, updatedRole, email);

        console.log(`UPDATED USER ACCOUNT '${email}' TO ROLE '${updatedRole}'`);

        return true;
    },
    removeUser: async (root, { email }, context) => {
        // Attempt to find an already existing user
        const checkUserQuery = await db.query("SELECT email FROM user_account AS ua WHERE ua.email = %L", email);
        const bUserExists = checkUserQuery.rowCount > 0;

        if (!bUserExists) {
            throw new Error(`User '${email}' does not exist`);
        }

        // Delete the user
        await db.query("DELETE FROM user_account AS ua WHERE ua.email = %L", email);

        return true;
    }
}