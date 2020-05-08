import gql from "graphql-tag";

export interface Data {
    login: boolean;
}

export interface Variables {
    username: string;
    password: string;
}

export const mutation = gql`
    mutation signin($username: String!, $password: String!) {
        login(credentials: { username: $username, password: $password })
    }
`;