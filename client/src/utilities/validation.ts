import axios from "axios";
import KEYS from "@/keys";

interface CheckUsernameResponse {
    data: {
        checkUsernameAvailability: boolean;
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

    // TODO: implement some form of debouncing
    const result = await axios.post<CheckUsernameResponse>(KEYS.GRAPHQL_API_ENDPOINT, data, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });

    return result.data.data.checkUsernameAvailability;
}