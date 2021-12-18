import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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

/** Credentials object for users. */
export type AccessCredentials = {
  __typename?: 'AccessCredentials';
  /** JWT access token. */
  access_token: Scalars['String'];
};

/** An artist collaboration. */
export type ArtistCollaboration = {
  __typename?: 'ArtistCollaboration';
  name: Scalars['String'];
  type: CollaborationType;
};

/** An artist input. */
export type ArtistInput = {
  name: Scalars['String'];
  type: CollaborationType;
};

export enum CollaborationType {
  Featured = 'FEATURED',
  Primary = 'PRIMARY',
  Remix = 'REMIX'
}

/** Input data for searching.  */
export type FingerprintInput = {
  fingerprintData: Scalars['Upload'];
  numberOfPartitions: Scalars['Int'];
  numberOfWindows: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Add a new track to the catalog. */
  addTrack: Track;
  /** Edit an existing track in the catalog. */
  editTrack: Track;
  /** Edits a user's account details. */
  editUser: Scalars['Boolean'];
  /** Edits a user's role. */
  editUserRole: Scalars['Boolean'];
  /** Login a user, creating a session. */
  login: AccessCredentials;
  /** Logout the current user, destroying the session. */
  logout: Scalars['Boolean'];
  /** Recomputes a track's stored fingerprint. */
  recomputeTrackFingerprint: Scalars['Boolean'];
  /** Remove a track from the catalog. */
  removeTrack: Scalars['Boolean'];
  /** Deletes a user account. */
  removeUser: Scalars['Boolean'];
  /** Searches for a track. */
  searchTrack: SearchResult;
  /** Signup and create a new user.  */
  signup: AccessCredentials;
};


export type MutationAddTrackArgs = {
  trackData: TrackAddDataInput;
};


export type MutationEditTrackArgs = {
  id: Scalars['Int'];
  trackData: TrackEditDataInput;
};


export type MutationEditUserArgs = {
  updatedCredentials: UpdateUserCredentialsInput;
  username: Scalars['String'];
};


export type MutationEditUserRoleArgs = {
  updatedRole: UserRole;
  username: Scalars['String'];
};


export type MutationLoginArgs = {
  userData: UserDataInput;
};


export type MutationRecomputeTrackFingerprintArgs = {
  fingerprint: FingerprintInput;
  id: Scalars['ID'];
};


export type MutationRemoveTrackArgs = {
  id: Scalars['Int'];
};


export type MutationRemoveUserArgs = {
  username: Scalars['String'];
};


export type MutationSearchTrackArgs = {
  args?: InputMaybe<SearchArgs>;
  fingerprint: FingerprintInput;
};


export type MutationSignupArgs = {
  userData: UserDataInput;
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
  filter?: InputMaybe<TracksFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryGetTracksNumArgs = {
  filter?: InputMaybe<TracksFilterInput>;
};

/** Arguments for a track search.  */
export type SearchArgs = {
  maxResults?: InputMaybe<Scalars['Int']>;
};

/** A track candidate for a search.  */
export type SearchCandidate = {
  __typename?: 'SearchCandidate';
  similarity: Scalars['Float'];
  track: Track;
};

/** Search result for an audio search.  */
export type SearchResult = {
  __typename?: 'SearchResult';
  candidates: Array<SearchCandidate>;
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

/** A track object. */
export type Track = {
  __typename?: 'Track';
  addressDatabase: Scalars['Int'];
  id: Scalars['Int'];
  metadata: TrackMetadata;
};

/** Input data for adding a new track. */
export type TrackAddDataInput = {
  artists: Array<ArtistInput>;
  coverArt?: InputMaybe<Scalars['Upload']>;
  duration: Scalars['Int'];
  fingerprint: FingerprintInput;
  releaseDate?: InputMaybe<Scalars['Date']>;
  title: Scalars['String'];
};

/** Input data for editing a track. */
export type TrackEditDataInput = {
  artists?: InputMaybe<Array<Scalars['String']>>;
  coverImage?: InputMaybe<Scalars['String']>;
  releaseDate?: InputMaybe<Scalars['Date']>;
  title?: InputMaybe<Scalars['String']>;
};

/** Metadata for a track. */
export type TrackMetadata = {
  __typename?: 'TrackMetadata';
  artists: Array<ArtistCollaboration>;
  coverImage?: Maybe<Scalars['String']>;
  createdDate: Scalars['Date'];
  duration: Scalars['Int'];
  numPlays: Scalars['Int'];
  releaseDate?: Maybe<Scalars['Date']>;
  title: Scalars['String'];
  updatedDate: Scalars['Date'];
};

export type TracksFilterInput = {
  uploader?: InputMaybe<Scalars['String']>;
};

/** Credentials input for updating a user account. */
export type UpdateUserCredentialsInput = {
  /** The password (in clear) of the user. */
  password?: InputMaybe<Scalars['String']>;
  /** The username of the user. */
  username?: InputMaybe<Scalars['String']>;
};

/** Credentials input for user login */
export type UserDataInput = {
  /** The password (in clear) of the user.  */
  password: Scalars['String'];
  /** The username of the user. */
  username: Scalars['String'];
};

export enum UserRole {
  Admin = 'Admin',
  Default = 'Default',
  Distributor = 'Distributor'
}

export type AddTrackMutationVariables = Exact<{
  trackData: TrackAddDataInput;
}>;


export type AddTrackMutation = { __typename?: 'Mutation', addTrack: { __typename?: 'Track', id: number, addressDatabase: number, metadata: { __typename?: 'TrackMetadata', title: string, coverImage?: string | null | undefined, releaseDate?: any | null | undefined, createdDate: any, updatedDate: any, artists: Array<{ __typename?: 'ArtistCollaboration', name: string, type: CollaborationType }> } } };

export type GetTracksQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  filter?: InputMaybe<TracksFilterInput>;
}>;


export type GetTracksQuery = { __typename?: 'Query', getTracksNum: number, getTracks: Array<{ __typename?: 'Track', id: number, addressDatabase: number, metadata: { __typename?: 'TrackMetadata', title: string, coverImage?: string | null | undefined, duration: number, numPlays: number, releaseDate?: any | null | undefined, createdDate: any, updatedDate: any, artists: Array<{ __typename?: 'ArtistCollaboration', name: string, type: CollaborationType }> } }> };

export type RemoveTrackMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type RemoveTrackMutation = { __typename?: 'Mutation', removeTrack: boolean };

export type SearchTrackMutationVariables = Exact<{
  fingerprint: FingerprintInput;
  args?: InputMaybe<SearchArgs>;
}>;


export type SearchTrackMutation = { __typename?: 'Mutation', searchTrack: { __typename?: 'SearchResult', candidates: Array<{ __typename?: 'SearchCandidate', similarity: number, track: { __typename?: 'Track', id: number, addressDatabase: number, metadata: { __typename?: 'TrackMetadata', title: string, coverImage?: string | null | undefined, releaseDate?: any | null | undefined, createdDate: any, updatedDate: any, artists: Array<{ __typename?: 'ArtistCollaboration', name: string, type: CollaborationType }> } } }> } };

export type CheckUsernameAvailabilityQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type CheckUsernameAvailabilityQuery = { __typename?: 'Query', checkUsernameAvailability: boolean };

export type SigninMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type SigninMutation = { __typename?: 'Mutation', login: { __typename?: 'AccessCredentials', access_token: string } };

export type SignoutMutationVariables = Exact<{ [key: string]: never; }>;


export type SignoutMutation = { __typename?: 'Mutation', logout: boolean };

export type SignupMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'AccessCredentials', access_token: string } };


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
export const SearchTrackDocument = gql`
    mutation searchTrack($fingerprint: FingerprintInput!, $args: SearchArgs) {
  searchTrack(fingerprint: $fingerprint, args: $args) {
    candidates {
      track {
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
      similarity
    }
  }
}
    `;
export const CheckUsernameAvailabilityDocument = gql`
    query CheckUsernameAvailability($username: String!) {
  checkUsernameAvailability(username: $username)
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

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    AddTrack(variables: AddTrackMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddTrackMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddTrackMutation>(AddTrackDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddTrack');
    },
    GetTracks(variables?: GetTracksQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetTracksQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetTracksQuery>(GetTracksDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetTracks');
    },
    RemoveTrack(variables: RemoveTrackMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RemoveTrackMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemoveTrackMutation>(RemoveTrackDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RemoveTrack');
    },
    searchTrack(variables: SearchTrackMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SearchTrackMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchTrackMutation>(SearchTrackDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'searchTrack');
    },
    CheckUsernameAvailability(variables: CheckUsernameAvailabilityQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CheckUsernameAvailabilityQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CheckUsernameAvailabilityQuery>(CheckUsernameAvailabilityDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CheckUsernameAvailability');
    },
    signin(variables: SigninMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SigninMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SigninMutation>(SigninDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'signin');
    },
    signout(variables?: SignoutMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SignoutMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SignoutMutation>(SignoutDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'signout');
    },
    signup(variables: SignupMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SignupMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SignupMutation>(SignupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'signup');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;