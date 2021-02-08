// TODO: remove

import gql from "graphql-tag";

export interface Data {
  signup: {
    access_token: string;
  };
}

export interface Variables {
  username: string;
  password: string;
}

export const mutation = gql`
  mutation signup($username: String!, $password: String!) {
    signup(username: $username, password: $password) {
      access_token
    }
  }
`;
