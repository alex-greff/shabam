const db = require("../../../db/main");

exports.getUser = async (i_sEmail) => {
    const query = `
        SELECT * FROM user_account AS ua WHERE ua.email = %L
    `;

    const res = await db.query(query, i_sEmail);

    if (res.rowCount > 0) {
        return res.rows[0];
    }

    return null;
};

exports.getUserByID = async (i_nID) => {
    const query = `
        SELECT * FROM user_account AS ua WHERE ua.user_account_id = %L
    `;

    const res = await db.query(query, `${i_nID}`);

    if (res.rowCount > 0) {
        return res.rows[0];
    }

    return null;
};

exports.updateLastUserLogin = async (i_sEmail, i_sLastLoginTime = null) => {
    const sLastLoginTimestamp = (i_sLastLoginTime) ? 
        `to_timestamp(${new Date(i_sLastLoginTime).getTime()} / 1000.0)` : `to_timestamp(${Date.now()} / 1000.0)`;

    const query = `
        UPDATE user_account AS ua SET last_login = %s WHERE ua.email = %L
    `;

    const res = await db.query(query, sLastLoginTimestamp, i_sEmail);

    return (res.rowCount > 0);
};

exports.userExists = async (i_sEmail) => {
    const query = `
        SELECT email FROM user_account AS ua WHERE ua.email = %L
    `;

    const res = await db.query(query, i_sEmail);

    return (res.rowCount > 0);
};

exports.createNewUser = async (i_sEmail, i_sPasswordHash, i_sRole, i_sSignupDate = null) => {
    const sSignupTimestamp = (i_sSignupDate) ? 
        `to_timestamp(${new Date(i_sSignupDate).getTime()} / 1000.0)` : `to_timestamp(${Date.now()} / 1000.0)`;

    const oNewUser = {
        email: i_sEmail,
        password: i_sPasswordHash,
        role: i_sRole,
        signup_date: sSignupTimestamp
    };

    const sNewUserKeys = Object.keys(oNewUser);
    const sNewUserValues = Object.values(oNewUser);

    const query = `
        INSERT INTO user_account(%I, %I, %I, %I) VALUES (%L, %L, %L, %s)
    `;

    await db.query(query, ...sNewUserKeys, ...sNewUserValues);
};

exports.editUser = async (i_sEmail, i_sNewEmail, i_sNewPasswordHash) => {
    const aUpdateArgs = [];
    let sUpdateListString = "";

    if (i_sNewEmail) {
        sUpdateListString += ", email = %L";
        aUpdateArgs.push(i_sNewEmail);
    }

    if (i_sNewPasswordHash) {
        sUpdateListString += ", password = %L";
        aUpdateArgs.push(i_sNewPasswordHash);
    }

    if (aUpdateArgs.length <= 0) {
        throw new Error("Error updating user, at least one field must be provided to update the user");
    }

    // Remove the leading ", "
    sUpdateListString = sUpdateListString.substring(2);

    const query = `
        UPDATE user_account AS ua SET ${sUpdateListString} WHERE ua.email = %L
    `;

    await db.query(query, ...aUpdateArgs, i_sEmail);
};

exports.editUserRole = async (i_sEmail, i_sNewRole) => {
    const query = `
        UPDATE user_account AS ua SET role = %L WHERE ua.email = %L
    `;

    await db.query(query, i_sNewRole, i_sEmail);
};

exports.deleteUser = async (i_sEmail) => {
    const query = `
        DELETE FROM user_account AS ua WHERE ua.email = %L
    `;

    await db.query(query, i_sEmail);
};