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
    `

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