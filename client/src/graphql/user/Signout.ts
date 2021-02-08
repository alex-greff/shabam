// TODO: remove

import gql from "graphql-tag";

export interface Data {
  logout: boolean;
}

export const mutation = gql`
  mutation signout {
    logout
  }
`;
