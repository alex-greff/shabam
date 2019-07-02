const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Utilities = require("../../utilities");
const db = require("../../../db");
const KEYS = require("../../../keys");

const DEFAULT_ROLE = "default";

module.exports = {
    login: async (root, { credentials }, context) => {
        const { email, password } = credentials;

        const getUserQuery = await db.query("SELECT user_account_id, email, role, password FROM user_account AS uc WHERE uc.email = %L", email);
        const bUserFound = getUserQuery.rowCount > 0;

        if (!bUserFound) {
            throw new Error("Authorization failed");
        }

        const sPasswordHash = getUserQuery.rows[0].password;

        try {
            // Compare the user's password
            bcrypt.compareSync(password, sPasswordHash);
        } catch(err) {
            // Password comparison failed
            throw new Error("Authorization failed");
        }

        const { user_account_id: _id, role } = getUserQuery.rows[0];

        // Generate token
        const oJWTPayload = {
            email: email,
            userID: _id,
            role: role
        };
        const oJWTOptions = {
            expiresIn: KEYS.jwtExpireTime
        };
        const sToken = jwt.sign(oJWTPayload, KEYS.jwtSecret, oJWTOptions);

        // Return the token
        return {
            token: sToken
        }
    },
    signup: async (root, { credentials }, context) => {
        const { email, password } = credentials;

        // Attempt to find an already existing user
        const checkUserQuery = await db.query("SELECT email FROM user_account WHERE email = %L", email);
        const bUserExists = checkUserQuery.rowCount > 0;

        if (bUserExists) {
            // If query doesn't error then the user already exists
            throw new Error(`User '${email}' already exists`);   
        }

        // Hash password
        const sPasswordHashed = bcrypt.hashSync(password, 10)
        
        const oNewUser = {
            email: email,
            password: sPasswordHashed,
            role: DEFAULT_ROLE,
            signup_date: `to_timestamp(${Date.now()} / 1000.0)`
        };

        const sNewUserKeys = Object.keys(oNewUser);
        const sNewUserValues = Object.values(oNewUser);

        // Create the new user
        const temp = await db.query(`INSERT INTO user_account(%I, %I, %I, %I) VALUES (%L, %L, %L, %s)`, ...sNewUserKeys, ...sNewUserValues);    
        console.log("save res", temp);

        return true;
    },
    editUser(root, { userID, updatedCredentials }, context) {
        return true;
    },
    editUserRole(root, { userID, updatedRole }, context) {
        return true;
    },
    removeUser(root, { userID }, context) {
        return false;
    }
}