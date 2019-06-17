const { buildSchema } = require("graphql");

module.exports = buildSchema(`
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

    type TrackAddInputData {
        title: String!
        artists: [String!]!
        coverImage: String
        releaseDate: String
    }

    type TrackEditInputData {
        title: String
        artists: [String]
        coverImage: String
        releaseDate: String
    }

    type RootQuery {
        getAllTracks: [Track!]!
        getTrack(trackID: String!): Track!
    }

    type RootMutation {
        addTrack(trackData: TrackAddInputData): Track!
        editTrack(trackData: TrackEditInputData): Track!
        deleteTrack(trackID: Int!): Boolean
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);