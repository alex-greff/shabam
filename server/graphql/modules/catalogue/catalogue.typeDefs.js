const gql = require("graphql-tag");

module.exports = gql`
    type TrackMetaData {
        title: String!
        artists: [String!]!
        coverImage: String
        releaseDate: String
        createdDate: String!
        updatedDate: String!
    }

    type Track {
        _id: ID!
        fingerprintID: Int!
        metaData: TrackMetaData!
    }

    input TrackAddInputData {
        title: String!
        artists: [String!]!
        coverImage: String
        releaseDate: String
    }

    input TrackEditInputData {
        title: String
        artists: [String]
        coverImage: String
        releaseDate: String
    }

    type Query {
        getAllTracks: [Track!]!
        getTrack(trackID: String!): Track!
    }

    type Mutation {
        addTrack(trackData: TrackAddInputData): Track!
        editTrack(trackData: TrackEditInputData): Track!
        deleteTrack(trackID: Int!): Boolean
    }
`;