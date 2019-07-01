// TODO: implement
module.exports = {
    login(root, { userCredentials }, context) {
        return {
            token: "r23wrfes32rtw3esrw3ef32wrw3rt3wtw3rw"
        }
    },
    signup(root, { userCredentials}, context) {
        return true;
    },
    editUser(root, { userID, updatedUserCredentials }, context) {
        return true;
    },
    removeUser(root, { userID }, context) {
        return false;
    }
}