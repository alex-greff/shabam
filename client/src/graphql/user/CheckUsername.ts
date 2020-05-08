import gql from "graphql-tag";

export interface Data {
    checkUsernameAvailability: boolean;
}

export interface Variables {
    username: string;
}

export const query = gql`
    query CheckUsername($username: String!) {
        checkUsernameAvailability(username: $username)
    }
`;