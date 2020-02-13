<<<<<<< HEAD
import db from "../../../db/main";
import { UserAccount } from "../../../index";

// TODO: remove the i_* prefix shit
=======
import { UserAccount } from "../../../types";
import * as db from "../../../db/main";

// const db = require("../../../db/main");
>>>>>>> typescript

export async function getUser(email: string): Promise<UserAccount | null> {
    const query = `
        SELECT * FROM user_account AS ua WHERE ua.email = $1
    `;

    const res = await db.query(query, email);

    if (res.rowCount > 0) {
        const data = res.rows[0];

        return {
            id: parseInt(data.user_account_id),
            email: data.email,
            password: data.password,
            role: data.role,
            signupDate: data.signup_date,
            lastLogin: data.last_login
        }
    }

    return null;
};

export async function getUserByID(ID: number): Promise<UserAccount | null> {
    const query = `
        SELECT * FROM user_account AS ua WHERE ua.user_account_id = $1
    `;

    const res = await db.query(query, ID);

    if (res.rowCount > 0) {
        const data = res.rows[0];

        return {
            id: parseInt(data.user_account_id),
            email: data.email,
            password: data.password,
            role: data.role,
            signupDate: data.signup_date,
            lastLogin: data.last_login
        }
    }

    return null;
};

export async function updateLastUserLogin(email: string, lastLoginTime?: string): Promise<void> {
<<<<<<< HEAD
    const dLastLogin = (lastLoginTime) ? new Date(lastLoginTime) : new Date();
=======
    const lastLogin = (lastLoginTime) ? new Date(lastLoginTime) : new Date();
>>>>>>> typescript

    const query = `
        UPDATE user_account AS ua SET last_login = $1 WHERE ua.email = $2
    `;

<<<<<<< HEAD
    await db.query(query, dLastLogin, email);
=======
    await db.query(query, lastLogin, email);
>>>>>>> typescript
};

export async function userExists(email: string): Promise<boolean> {
    const query = `
        SELECT email FROM user_account AS ua WHERE ua.email = $1
    `;

    const res = await db.query(query, email);

    return (res.rowCount > 0);
};

export async function createNewUser(email: string, passwordHash: string, role: string, signupDate?: string): Promise<void> {
<<<<<<< HEAD
    const dSignupDate = (signupDate) ? new Date(signupDate) : new Date();

    const oNewUser = {
        email: email,
        password: passwordHash,
        role: role,
        signup_date: dSignupDate
    };

    const newUserKeys = Object.keys(oNewUser);
    const newUserValues = Object.values(oNewUser);
=======
    const signupDateCleaned = (signupDate) ? new Date(signupDate) : new Date();

    const newUser = {
        email: email,
        password: passwordHash,
        role: role,
        signup_date: signupDateCleaned
    };

    const newUserKeys = Object.keys(newUser);
    const newUserValues = Object.values(newUser);
>>>>>>> typescript

    const query = `
        INSERT INTO user_account($1, $2, $3, $4) VALUES ($5, $6, $7, $8)
    `;

    await db.query(query, ...newUserKeys, ...newUserValues);
};

export async function editUser(email: string, newEmail?: string, newPasswordHash?: string): Promise<void> {
<<<<<<< HEAD
    const aUpdateArgs = [];
    let sUpdateListString = "";

    let nCurrParam = 1;

    if (newEmail) {
        sUpdateListString += `, email = $${nCurrParam}`;
        aUpdateArgs.push(newEmail);
        nCurrParam++;
    }

    if (newPasswordHash) {
        sUpdateListString += `, password = $${nCurrParam}`;
        aUpdateArgs.push(newPasswordHash);
        nCurrParam++;
    }

    if (aUpdateArgs.length <= 0) {
=======
    const updateArgs = [];
    let updateListString = "";

    let currParam = 1;

    if (newEmail) {
        updateListString += `, email = $${currParam}`;
        updateArgs.push(newEmail);
        currParam++;
    }

    if (newPasswordHash) {
        updateListString += `, password = $${currParam}`;
        updateArgs.push(newPasswordHash);
        currParam++;
    }

    if (updateArgs.length <= 0) {
>>>>>>> typescript
        throw new Error("Error updating user, at least one field must be provided to update the user");
    }

    // Remove the leading ", "
<<<<<<< HEAD
    sUpdateListString = sUpdateListString.substring(2);

    const query = `
        UPDATE user_account AS ua SET ${sUpdateListString} WHERE ua.email = $${nCurrParam}
    `;

    await db.query(query, ...aUpdateArgs, email);
=======
    updateListString = updateListString.substring(2);

    const query = `
        UPDATE user_account AS ua SET ${updateListString} WHERE ua.email = $${currParam}
    `;

    await db.query(query, ...updateArgs, email);
>>>>>>> typescript
};

export async function editUserRole(email: string, newRole: string): Promise<void> {
    const query = `
        UPDATE user_account AS ua SET role = $1 WHERE ua.email = $2
    `;

    await db.query(query, newRole, email);
};

export async function deleteUser(email: string): Promise<void> {
    const query = `
        DELETE FROM user_account AS ua WHERE ua.email = $1
    `;

    await db.query(query, email);
};