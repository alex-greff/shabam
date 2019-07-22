const gql = require("graphql-tag");

module.exports = gql`
    """Meta-data for a track."""
    type TrackMetaData {
        title: String!
        artists: [String!]!
        coverImage: String
        uploaderEmail: String!
        releaseDate: String
        createdDate: String!
        updatedDate: String!
    }

    """A track object."""
    type Track {
        _id: ID!
        fingerprintData: String! # TODO: make fingerprint type
        metaData: TrackMetaData!
    }

    """Input data for adding a new track."""
    input TrackAddInputData {
        title: String!
        artists: [String!]!
        coverImage: String
        releaseDate: String
        # TODO: add signal data field
    }

    """Input data for editing a track."""
    input TrackEditInputData {
        title: String
        artists: [String]
        coverImage: String
        releaseDate: String
        # TODO: add optional signal data field
    }

    type Query {
        """Get all tracks in the catalogue."""
        getAllTracks: [Track!]!
        """Get a specific track in the catalogue."""
        getTrack(title: String!, artists: [String!]!): Track!
        """Searches for a track based off the given PCM audio signal data."""
        searchTrack(audioFile: Upload!): Track
    }

    type Mutation {
        """Add a new track to the catalogue."""
        addTrack(trackData: TrackAddInputData): Track!
        """Edit an existing track in the catalogue."""
        editTrack(title: String!, artists: [String!]!, updatedTrackData: TrackEditInputData): Track!
        """Remove a track from the catalogue."""
        deleteTrack(title: String!, artists: [String!]!): Boolean
    }
`;