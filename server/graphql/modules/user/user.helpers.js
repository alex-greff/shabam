const db = require("../../../db/main");

exports.getUser = async (i_sEmail) => {
    const query = `
        SELECT * FROM user_account AS ua WHERE ua.email = $1
    `;

    const res = await db.query(query, i_sEmail);

    if (res.rowCount > 0) {
        return res.rows[0];
    }

    return null;
};

exports.getUserByID = async (i_nID) => {
    const query = `
        SELECT * FROM user_account AS ua WHERE ua.user_account_id = $1
    `;

    const res = await db.query(query, i_nID);

    if (res.rowCount > 0) {
        return res.rows[0];
    }

    return null;
};

exports.updateLastUserLogin = async (i_sEmail, i_sLastLoginTime = null) => {
    const dLastLogin = (i_sLastLoginTime) ? new Date(i_sLastLoginTime) : new Date();

    const query = `
        UPDATE user_account AS ua SET last_login = $1 WHERE ua.email = $2
    `;

    const res = await db.query(query, dLastLogin, i_sEmail);

    return (res.rowCount > 0);
};

exports.userExists = async (i_sEmail) => {
    const query = `
        SELECT email FROM user_account AS ua WHERE ua.email = $1
    `;

    const res = await db.query(query, i_sEmail);

    return (res.rowCount > 0);
};

exports.createNewUser = async (i_sEmail, i_sPasswordHash, i_sRole, i_sSignupDate = null) => {
    const dSignupDate = (i_sSignupDate) ? new Date(i_sSignupDate) : new Date();

    const oNewUser = {
        email: i_sEmail,
        password: i_sPasswordHash,
        role: i_sRole,
        signup_date: dSignupDate
    };

    const sNewUserKeys = Object.keys(oNewUser);
    const sNewUserValues = Object.values(oNewUser);

    const query = `
        INSERT INTO user_account($1, $2, $3, $4) VALUES ($5, $6, $7, $8)
    `;

    await db.query(query, ...sNewUserKeys, ...sNewUserValues);
};

exports.editUser = async (i_sEmail, i_sNewEmail, i_sNewPasswordHash) => {
    const aUpdateArgs = [];
    let sUpdateListString = "";

    const nCurrParam = 1;

    if (i_sNewEmail) {
        sUpdateListString += `, email = $${nCurrParam}`;
        aUpdateArgs.push(i_sNewEmail);
        nCurrParam++;
    }

    if (i_sNewPasswordHash) {
        sUpdateListString += `, password = $${nCurrParam}`;
        aUpdateArgs.push(i_sNewPasswordHash);
        nCurrParam++;
    }

    if (aUpdateArgs.length <= 0) {
        throw new Error("Error updating user, at least one field must be provided to update the user");
    }

    // Remove the leading ", "
    sUpdateListString = sUpdateListString.substring(2);

    const query = `
        UPDATE user_account AS ua SET ${sUpdateListString} WHERE ua.email = $${nCurrParam}
    `;

    await db.query(query, ...aUpdateArgs, i_sEmail);
};

exports.editUserRole = async (i_sEmail, i_sNewRole) => {
    const query = `
        UPDATE user_account AS ua SET role = $1 WHERE ua.email = $2
    `;

    await db.query(query, i_sNewRole, i_sEmail);
};

exports.deleteUser = async (i_sEmail) => {
    const query = `
        DELETE FROM user_account AS ua WHERE ua.email = $1
    `;

    await db.query(query, i_sEmail);
};