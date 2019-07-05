const gql = require("graphql-tag");

module.exports = gql`
    """Meta-data for a track."""
    type TrackMetaData {
        title: String!
        artists: [String!]!
        coverImage: String
        releaseDate: String
        createdDate: String!
        updatedDate: String!
    }

    """A track object."""
    type Track {
        _id: ID!
        fingerprintID: Int!
        metaData: TrackMetaData!
    }

    """Input data for adding a new track."""
    input TrackAddInputData {
        title: String!
        artists: [String!]!
        coverImage: String
        releaseDate: String
    }

    """Input data for editing a track."""
    input TrackEditInputData {
        title: String
        artists: [String]
        coverImage: String
        releaseDate: String
    }

    type Query {
        """Get all tracks in the catalogue."""
        getAllTracks: [Track!]!
        """Get a specific track in the catalogue."""
        getTrack(trackID: String!): Track!
    }

    type Mutation {
        """Add a new track to the catalogue."""
        addTrack(trackData: TrackAddInputData): Track!
        """Edit an existing track in the catalogue."""
        editTrack(trackData: TrackEditInputData): Track!
        """Remove a track from the catalogue."""
        deleteTrack(trackID: Int!): Boolean
    }
`;