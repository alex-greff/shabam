import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Date scalar type */
  Date: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

/** An artist collaboration. */
export type ArtistCollaboration = {
  __typename?: 'ArtistCollaboration';
  name: Scalars['String'];
  type: CollaborationType;
};

export enum CollaborationType {
  Primary = 'PRIMARY',
  Featured = 'FEATURED',
  Remix = 'REMIX'
}

/** Credentials object for users. */
export type AccessCredentials = {
  __typename?: 'AccessCredentials';
  /** JWT access token. */
  access_token: Scalars['String'];
};

/** Metadata for a track. */
export type TrackMetadata = {
  __typename?: 'TrackMetadata';
  title: Scalars['String'];
  artists: Array<ArtistCollaboration>;
  coverImage?: Maybe<Scalars['String']>;
  duration: Scalars['Int'];
  numPlays: Scalars['Int'];
  releaseDate?: Maybe<Scalars['Date']>;
  createdDate: Scalars['Date'];
  updatedDate: Scalars['Date'];
};


/** A track object. */
export type Track = {
  __typename?: 'Track';
  id: Scalars['Int'];
  addressDatabase: Scalars['Int'];
  metadata: TrackMetadata;
};

/** Search result for an audio search.  */
export type SearchResult = {
  __typename?: 'SearchResult';
  something: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  /** Checks if the given username is available.  */
  checkUsernameAvailability: Scalars['Boolean'];
  /** Get a specific track in the catalog. */
  getTrack: Track;
  /** Get a paginated list of all tracks in the catalog. */
  getTracks: Array<Track>;
  /** Gives how many tracks are in the result for the given filter query */
  getTracksNum: Scalars['Int'];
};


export type QueryCheckUsernameAvailabilityArgs = {
  username: Scalars['String'];
};


export type QueryGetTrackArgs = {
  id: Scalars['Int'];
};


export type QueryGetTracksArgs = {
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  filter?: Maybe<TracksFilterInput>;
};


export type QueryGetTracksNumArgs = {
  filter?: Maybe<TracksFilterInput>;
};

export type TracksFilterInput = {
  uploader?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Login a user, creating a session. */
  login: AccessCredentials;
  /** Logout the current user, destroying the session. */
  logout: Scalars['Boolean'];
  /** Signup and create a new user.  */
  signup: AccessCredentials;
  /** Edits a user's account details. */
  editUser: Scalars['Boolean'];
  /** Edits a user's role. */
  editUserRole: Scalars['Boolean'];
  /** Deletes a user account. */
  removeUser: Scalars['Boolean'];
  /** Add a new track to the catalog. */
  addTrack: Track;
  /** Edit an existing track in the catalog. */
  editTrack: Track;
  /** Remove a track from the catalog. */
  removeTrack: Scalars['Boolean'];
  /** Recomputes a track's stored fingerprint. */
  recomputeTrackFingerprint: Scalars['Boolean'];
  /** Search for a track. */
  search: SearchResult;
};


export type MutationLoginArgs = {
  userData: UserDataInput;
};


export type MutationSignupArgs = {
  userData: UserDataInput;
};


export type MutationEditUserArgs = {
  updatedCredentials: UpdateUserCredentialsInput;
  username: Scalars['String'];
};


export type MutationEditUserRoleArgs = {
  updatedRole: UserRole;
  username: Scalars['String'];
};


export type MutationRemoveUserArgs = {
  username: Scalars['String'];
};


export type MutationAddTrackArgs = {
  trackData: TrackAddDataInput;
};


export type MutationEditTrackArgs = {
  trackData: TrackEditDataInput;
  id: Scalars['Int'];
};


export type MutationRemoveTrackArgs = {
  id: Scalars['Int'];
};


export type MutationRecomputeTrackFingerprintArgs = {
  fingerprint: FingerprintInput;
  id: Scalars['ID'];
};


export type MutationSearchArgs = {
  fingerprint: FingerprintInput;
};

/** Credentials input for user login */
export type UserDataInput = {
  /** The username of the user. */
  username: Scalars['String'];
  /** The password (in clear) of the user.  */
  password: Scalars['String'];
};

/** Credentials input for updating a user account. */
export type UpdateUserCredentialsInput = {
  /** The username of the user. */
  username?: Maybe<Scalars['String']>;
  /** The password (in clear) of the user. */
  password?: Maybe<Scalars['String']>;
};

export enum UserRole {
  Admin = 'Admin',
  Distributor = 'Distributor',
  Default = 'Default'
}

/** Input data for adding a new track. */
export type TrackAddDataInput = {
  title: Scalars['String'];
  artists: Array<ArtistInput>;
  releaseDate?: Maybe<Scalars['Date']>;
  fingerprint: FingerprintInput;
  duration: Scalars['Int'];
  coverArt?: Maybe<Scalars['Upload']>;
};

/** An artist input. */
export type ArtistInput = {
  name: Scalars['String'];
  type: CollaborationType;
};

/** Input data for searching.  */
export type FingerprintInput = {
  numberOfWindows: Scalars['Int'];
  numberOfPartitions: Scalars['Int'];
  fingerprintData: Scalars['Upload'];
};


/** Input data for editing a track. */
export type TrackEditDataInput = {
  title?: Maybe<Scalars['String']>;
  artists?: Maybe<Array<Scalars['String']>>;
  coverImage?: Maybe<Scalars['String']>;
  releaseDate?: Maybe<Scalars['Date']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Notifies whenever a track is added.  */
  trackAdded: Track;
  /** Notifies whenever a track is added. Can filter by track id. */
  trackEdited: Track;
  /** Notifies whenever a track is deleted. Can filter by track id. */
  trackRemoved: Scalars['String'];
};

export type AddTrackMutationVariables = Exact<{
  trackData: TrackAddDataInput;
}>;


export type AddTrackMutation = (
  { __typename?: 'Mutation' }
  & { addTrack: (
    { __typename?: 'Track' }
    & Pick<Track, 'id' | 'addressDatabase'>
    & { metadata: (
      { __typename?: 'TrackMetadata' }
      & Pick<TrackMetadata, 'title' | 'coverImage' | 'releaseDate' | 'createdDate' | 'updatedDate'>
      & { artists: Array<(
        { __typename?: 'ArtistCollaboration' }
        & Pick<ArtistCollaboration, 'name' | 'type'>
      )> }
    ) }
  ) }
);

export type GetTracksQueryVariables = Exact<{
  offset?: Maybe<Scalars['Int']>;
  limit?: Maybe<Scalars['Int']>;
  filter?: Maybe<TracksFilterInput>;
}>;


export type GetTracksQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'getTracksNum'>
  & { getTracks: Array<(
    { __typename?: 'Track' }
    & Pick<Track, 'id' | 'addressDatabase'>
    & { metadata: (
      { __typename?: 'TrackMetadata' }
      & Pick<TrackMetadata, 'title' | 'coverImage' | 'duration' | 'numPlays' | 'releaseDate' | 'createdDate' | 'updatedDate'>
      & { artists: Array<(
        { __typename?: 'ArtistCollaboration' }
        & Pick<ArtistCollaboration, 'name' | 'type'>
      )> }
    ) }
  )> }
);

export type RemoveTrackMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type RemoveTrackMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'removeTrack'>
);

export type CheckUsernameAvailabilityQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type CheckUsernameAvailabilityQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'checkUsernameAvailability'>
);

export type SearchMutationVariables = Exact<{
  fingerprint: FingerprintInput;
}>;


export type SearchMutation = (
  { __typename?: 'Mutation' }
  & { search: (
    { __typename?: 'SearchResult' }
    & Pick<SearchResult, 'something'>
  ) }
);

export type SigninMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type SigninMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'AccessCredentials' }
    & Pick<AccessCredentials, 'access_token'>
  ) }
);

export type SignoutMutationVariables = Exact<{ [key: string]: never; }>;


export type SignoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type SignupMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignupMutation = (
  { __typename?: 'Mutation' }
  & { signup: (
    { __typename?: 'AccessCredentials' }
    & Pick<AccessCredentials, 'access_token'>
  ) }
);


export const AddTrackDocument = gql`
    mutation AddTrack($trackData: TrackAddDataInput!) {
  addTrack(trackData: $trackData) {
    id
    addressDatabase
    metadata {
      title
      artists {
        name
        type
      }
      coverImage
      releaseDate
      createdDate
      updatedDate
    }
  }
}
    `;
export const GetTracksDocument = gql`
    query GetTracks($offset: Int = 0, $limit: Int = 25, $filter: TracksFilterInput) {
  getTracks(offset: $offset, limit: $limit, filter: $filter) {
    id
    addressDatabase
    metadata {
      title
      artists {
        name
        type
      }
      coverImage
      duration
      numPlays
      releaseDate
      createdDate
      updatedDate
    }
  }
  getTracksNum(filter: $filter)
}
    `;
export const RemoveTrackDocument = gql`
    mutation RemoveTrack($id: Int!) {
  removeTrack(id: $id)
}
    `;
export const CheckUsernameAvailabilityDocument = gql`
    query CheckUsernameAvailability($username: String!) {
  checkUsernameAvailability(username: $username)
}
    `;
export const SearchDocument = gql`
    mutation search($fingerprint: FingerprintInput!) {
  search(fingerprint: $fingerprint) {
    something
  }
}
    `;
export const SigninDocument = gql`
    mutation signin($username: String!, $password: String!) {
  login(userData: {username: $username, password: $password}) {
    access_token
  }
}
    `;
export const SignoutDocument = gql`
    mutation signout {
  logout
}
    `;
export const SignupDocument = gql`
    mutation signup($username: String!, $password: String!) {
  signup(userData: {username: $username, password: $password}) {
    access_token
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    AddTrack(variables: AddTrackMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddTrackMutation> {
      return withWrapper(() => client.request<AddTrackMutation>(AddTrackDocument, variables, requestHeaders));
    },
    GetTracks(variables?: GetTracksQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetTracksQuery> {
      return withWrapper(() => client.request<GetTracksQuery>(GetTracksDocument, variables, requestHeaders));
    },
    RemoveTrack(variables: RemoveTrackMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RemoveTrackMutation> {
      return withWrapper(() => client.request<RemoveTrackMutation>(RemoveTrackDocument, variables, requestHeaders));
    },
    CheckUsernameAvailability(variables: CheckUsernameAvailabilityQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CheckUsernameAvailabilityQuery> {
      return withWrapper(() => client.request<CheckUsernameAvailabilityQuery>(CheckUsernameAvailabilityDocument, variables, requestHeaders));
    },
    search(variables: SearchMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SearchMutation> {
      return withWrapper(() => client.request<SearchMutation>(SearchDocument, variables, requestHeaders));
    },
    signin(variables: SigninMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SigninMutation> {
      return withWrapper(() => client.request<SigninMutation>(SigninDocument, variables, requestHeaders));
    },
    signout(variables?: SignoutMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SignoutMutation> {
      return withWrapper(() => client.request<SignoutMutation>(SignoutDocument, variables, requestHeaders));
    },
    signup(variables: SignupMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SignupMutation> {
      return withWrapper(() => client.request<SignupMutation>(SignupDocument, variables, requestHeaders));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;