const gql = require("graphql-tag");

module.exports = gql`
    """A user object."""
    type User {
        """The ID of the user in the database."""
        _id: ID!
        """The email of the user."""
        email: String!
        """The hashed password of the user."""
        password: String!
    }

    """JWT token for executing protected queries/mutations."""
    type Token {
        token: String!
    }

    """Credentials input for user login."""
    input UserCredentialsInput {
        """The email of the user."""
        email: String!
        """The password of the user."""
        password: String!
    }

    """Crdentials input for updating a user account."""
    input UpdateUserCredentailsInput {
        """(Optional) The new email of the user."""
        email: String
        """(Optional) The new password of the user."""
        password: String
    }

    type Query {
        """Logins a user and returns a token."""
        login(credentials: UserCredentialsInput!): Token
    }

    type Mutation {
        """Signup and create     a new user."""
        signup(credentials: UserCredentialsInput!): Boolean!
        """Edit user account details."""
        editUser(userID: Int!, updatedCredentials: UpdateUserCredentailsInput!): Boolean!
        """Edits a user's role."""
        editUserRole(userID: Int!, updatedRole: String!): Boolean!
        """Remove user account."""
        removeUser(userID: String!): Boolean!
    }
`;