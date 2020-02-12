import gql from "graphql-tag";

// const gql = require("graphql-tag");

export default gql`
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
        addressDatabase: Int
        metaData: TrackMetaData!
    }

    """Supporting information for the raw compressed fingerprint data"""
    input FingerprintInfo {
        windowAmount: Int!
        partitionAmount: Int!
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
        getTrack(trackID: Int!): Track!
        """Searches for a track based off the given fingerprint of the audio data."""
        searchTrack(fingerprint: Upload!, fingerprintInfo: FingerprintInfo!): Track
    }

    type Mutation {
        """Add a new track to the catalogue."""
        addTrack(trackData: TrackAddInputData): Track!
        # addTrack(fingerprint: Upload!, trackData: TrackAddInputData): Track! # TODO: use this addTrack
        """Edit an existing track in the catalogue."""
        editTrack(trackID: Int!, updatedTrackData: TrackEditInputData): Track!
        """Remove a track from the catalogue."""
        deleteTrack(trackID: Int!): Boolean
        """Recomputes the track's stored fingerprint"""
        recomputeTrackFingerprint(trackID: Int!, fingerprint: Upload!): Boolean
    }
`;