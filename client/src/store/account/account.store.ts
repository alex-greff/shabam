import { observable, computed, action } from "mobx";
import cookie from "cookie";

// -------------------------
// --- Type Declarations ---
// -------------------------


// -------------------
// --- Store Class ---
// -------------------

class AccountStore {
    @observable
    username?: string;

    constructor() {
        const cookies = cookie.parse(document.cookie);
        this.username = cookies.username;
    }

    @computed
    get loggedIn() {
        return !!this.username;
    }

    @action
    setLoggedIn(username: string) {
        this.username = username;
    }

    @action
    setLoggedOut() {
        this.username = undefined;
    }
}

export const accountStore = new AccountStore();