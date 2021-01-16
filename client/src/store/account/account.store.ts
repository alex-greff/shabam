import { observable, computed, action } from "mobx";
import cookie from "cookie";
import { TOKEN_STORAGE_KEY } from "@/constants";

// -------------------------
// --- Type Declarations ---
// -------------------------

interface UserTokenStorage {
  username: string;
  token: string;
}

// -------------------
// --- Store Class ---
// -------------------

class AccountStore {
  @observable
  username?: string;

  @observable
  token?: string;

  constructor() {
    const tokenStorageRaw = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (tokenStorageRaw) {
      const tokenStorage = JSON.parse(tokenStorageRaw) as UserTokenStorage;
      this.username = tokenStorage.username;
      this.token = tokenStorage.token;
    }

    // TODO: remove
    // const cookies = cookie.parse(document.cookie);
    // this.username = cookies.username;
  }

  @computed
  get loggedIn() {
    return !!this.username;
  }

  @action
  setLoggedIn(username: string, token: string) {
    const tokenStorage: UserTokenStorage = {
      username,
      token
    };
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenStorage));

    this.username = username;
    this.token = token;
  }

  @action
  setLoggedOut() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    this.username = undefined;
    this.token = undefined;
  }
}

export const accountStore = new AccountStore();
