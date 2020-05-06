import axios from "axios";
import KEYS from "@/keys";
import { accountStore } from "@/store/account/account.store";

interface CheckUsernameResponse {
    data: {
        checkUsernameAvailability: boolean;
    }
}

interface SigninResponse {
    data: {
        login: boolean;
    }
}

interface SignupResponse {
    data: {
        signup: boolean;
    }
}

interface SignoutResponse {
    data: {
        logout: boolean;
    }
}

export const checkUsername = async (username: string) => {
    const query = `
        query checkUsername($username: String!) {
            checkUsernameAvailability(username: $username)
        }
    `;

    const variables = {
        username
    };

    const data = {
        query,
        variables
    }

    const result = await axios.post<CheckUsernameResponse>(KEYS.GRAPHQL_API_ENDPOINT, data);

    return result.data.data.checkUsernameAvailability;
};


export const signin = async (username: string, password: string) => {
    const query = `
        query signin($username: String!, $password: String!) {
            login(credentials: { username: $username, password: $password })
        }
    `;

    const variables = {
        username,
        password
    };

    const data = {
        query,
        variables
    };

    const result = await axios.post<SigninResponse>(KEYS.GRAPHQL_API_ENDPOINT, data);

    const signedIn = result.data.data.login;

    if (signedIn) {
        // Update the mobx store
        accountStore.setLoggedIn(username);
    }

    return signedIn;
};

export const signup = async (username: string, password: string) => {
    const query = `
        mutation signup($username: String!, $password: String!) {
            signup(credentials: { username: $username, password: $password })
        }
    `;

    const variables = {
        username,
        password
    };

    const data = {
        query,
        variables
    };

    const result = await axios.post<SignupResponse>(KEYS.GRAPHQL_API_ENDPOINT, data);

    return result.data.data.signup;
};

export const signout = async () => {
    const query = `
        query signout() {
            logout
        }
    `;

    const data = {
        query
    };

    const result = await axios.post<SignoutResponse>(KEYS.GRAPHQL_API_ENDPOINT, data);

    return result.data.data.logout;
}