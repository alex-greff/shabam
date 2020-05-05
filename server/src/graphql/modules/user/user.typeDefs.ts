import { gql } from "apollo-server-express";

export default gql`
    type Query {
        """Login a user, creating a session."""
        login(credentials: UserCredentialsInput!): Boolean!
        """Logout the current user, destroying the session."""
        logout: Boolean!
        """Checks if the given username is available."""
        checkUsernameAvailability(username: String!): Boolean!
    }

    type Mutation {
        """Signup and create a new user."""
        signup(credentials: UserCredentialsInput!): Boolean!
        """Edit user account details."""
        editUser(username: String!, updatedCredentials: UpdateUserCredentialsInput!): Boolean!
        """Edits a user's role."""
        editUserRole(username: String!, updatedRole: String!): Boolean!
        """Remove user account."""
        removeUser(username: String!): Boolean!
    }

    """A user object."""
    type User {
        """The ID of the user in the database."""
        _id: ID!
        """The username of the user."""
        username: String!
        """The hashed password of the user."""
        password: String!
    }

    """Credentials input for user login."""
    input UserCredentialsInput {
        """The username of the user."""
        username: String!
        """The password of the user."""
        password: String!
    }

    """Credentials input for updating a user account."""
    input UpdateUserCredentialsInput {
        """(Optional) The new username of the user."""
        username: String
        """(Optional) The new password of the user."""
        password: String
    }
`;
