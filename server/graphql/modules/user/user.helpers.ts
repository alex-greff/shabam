import { UserAccount } from "@/types/schema";
import * as db from "@/db/main";

export async function getUser(username: string): Promise<UserAccount | null> {
    const query = `
        SELECT * FROM user_account AS ua WHERE ua.username = $1
    `;

    const res = await db.query(query, username);

    if (res.rowCount > 0) {
        const data = res.rows[0];

        return {
            id: parseInt(data.user_account_id),
            username: data.username,
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
            username: data.username,
            password: data.password,
            role: data.role,
            signupDate: data.signup_date,
            lastLogin: data.last_login
        }
    }

    return null;
};

export async function updateLastUserLogin(username: string, lastLoginTime?: string): Promise<void> {
    const lastLogin = (lastLoginTime) ? new Date(lastLoginTime) : new Date();

    const query = `
        UPDATE user_account AS ua SET last_login = $1 WHERE ua.username = $2
    `;

    await db.query(query, lastLogin, username);
};

export async function userExists(username: string): Promise<boolean> {
    const query = `
        SELECT username FROM user_account AS ua WHERE ua.username = $1
    `;

    const res = await db.query(query, username);

    return (res.rowCount > 0);
};

export async function createNewUser(username: string, passwordHash: string, role: string, signupDate?: string): Promise<void> {
    const signupDateCleaned = (signupDate) ? new Date(signupDate) : new Date();

    const newUser = {
        username: username,
        password: passwordHash,
        role: role,
        signup_date: signupDateCleaned
    };

    const newUserKeys = Object.keys(newUser);
    const newUserValues = Object.values(newUser);

    const query = `
        INSERT INTO user_account($1, $2, $3, $4) VALUES ($5, $6, $7, $8)
    `;

    await db.query(query, ...newUserKeys, ...newUserValues);
};

export async function editUser(username: string, newUsername?: string, newPasswordHash?: string): Promise<void> {
    const updateArgs = [];
    let updateListString = "";

    let currParam = 1;

    if (newUsername) {
        updateListString += `, username = $${currParam}`;
        updateArgs.push(newUsername);
        currParam++;
    }

    if (newPasswordHash) {
        updateListString += `, password = $${currParam}`;
        updateArgs.push(newPasswordHash);
        currParam++;
    }

    if (updateArgs.length <= 0) {
        throw new Error("Error updating user, at least one field must be provided to update the user");
    }

    // Remove the leading ", "
    updateListString = updateListString.substring(2);

    const query = `
        UPDATE user_account AS ua SET ${updateListString} WHERE ua.username = $${currParam}
    `;

    await db.query(query, ...updateArgs, username);
};

export async function editUserRole(username: string, newRole: string): Promise<void> {
    const query = `
        UPDATE user_account AS ua SET role = $1 WHERE ua.username = $2
    `;

    await db.query(query, newRole, username);
};

export async function deleteUser(username: string): Promise<void> {
    const query = `
        DELETE FROM user_account AS ua WHERE ua.username = $1
    `;

    await db.query(query, username);
};