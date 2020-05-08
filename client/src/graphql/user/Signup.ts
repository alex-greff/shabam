import gql from "graphql-tag";

export interface Data {
    signup: boolean;
}

export interface Variables {
    username: string;
    password: string;
}

export const mutation = gql`
    mutation signup($username: String!, $password: String!) {
        signup(credentials: { username: $username, password: $password })
    }
`;