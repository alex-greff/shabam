const gql = require("graphql-tag");

module.exports = gql`
    type User {
        _id: ID!
        email: String!
        password: String!
    }

    type Token {
        token: String!
    }

    input UserCredentialsInput {
        email: String!
        password: String!
    }

    input UpdateUserCredentailsInput {
        email: String
        password: String
    }

    type Query {
        login(credentials: UserCredentialsInput!): Token
    }

    type Mutation {
        signup(credentials: UserCredentialsInput!): Boolean!
        editUser(userID: String!, updatedUserCredentials: UpdateUserCredentailsInput!): Boolean!
        removeUser(userID: String!): Boolean!
    }
`;