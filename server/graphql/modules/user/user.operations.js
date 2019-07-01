const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Utilities = require("../../utilities");
const db = require("../../../db");

const DEFAULT_ROLE = "default";

module.exports = {
    login: async (root, { credentials }, context) => {
        // const { email, password } = credentials;

        // let sPasswordHashed;

        // try {
        //     const queryRes = await db.query(`SELECT email, password FROM user_account WHERE email = '${email}'`);
        //     console.log("Query res", queryRes);
        // } catch(err) {} // Do nothing

        // TODO: complete

        return {
            token: "r23wrfes32rtw3esrw3ef32wrw3rt3wtw3rw"
        }
    },
    signup: async (root, { credentials }, context) => {
        const { email, password } = credentials;

        // Attempt to find an already existing user
        const checkUserQuery = await db.query(`SELECT email FROM user_account WHERE email = %L`, email);
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
    removeUser(root, { userID }, context) {
        return false;
    }
}