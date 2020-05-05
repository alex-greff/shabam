import axios from "axios";

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

    const result = await axios.post<CheckUsernameResponse>("/api/graphql", data, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });

    return result.data.data.checkUsernameAvailability;
}