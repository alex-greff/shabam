import gql from "graphql-tag";

export interface Data {
  login: {
    access_token: string;
  };
}

export interface Variables {
  username: string;
  password: string;
}

export const mutation = gql`
  mutation signin($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      access_token
    }
  }
`;
