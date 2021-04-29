import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
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

/** A track candidate for a search.  */
export type SearchCandidate = {
  __typename?: 'SearchCandidate';
  track: Track;
  similarity: Scalars['Float'];
};

/** Search result for an audio search.  */
export type SearchResult = {
  __typename?: 'SearchResult';
  candidates: Array<SearchCandidate>;
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
  /** Searches for a track. */
  searchTrack: SearchResult;
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


export type MutationSearchTrackArgs = {
  args?: Maybe<SearchArgs>;
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

/** Arguments for a track search.  */
export type SearchArgs = {
  maxResults?: Maybe<Scalars['Int']>;
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

export type SearchTrackMutationVariables = Exact<{
  fingerprint: FingerprintInput;
  args?: Maybe<SearchArgs>;
}>;


export type SearchTrackMutation = (
  { __typename?: 'Mutation' }
  & { searchTrack: (
    { __typename?: 'SearchResult' }
    & { candidates: Array<(
      { __typename?: 'SearchCandidate' }
      & Pick<SearchCandidate, 'similarity'>
      & { track: (
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
    )> }
  ) }
);

export type CheckUsernameAvailabilityQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type CheckUsernameAvailabilityQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'checkUsernameAvailability'>
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
export type AddTrackMutationFn = Apollo.MutationFunction<AddTrackMutation, AddTrackMutationVariables>;

/**
 * __useAddTrackMutation__
 *
 * To run a mutation, you first call `useAddTrackMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddTrackMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addTrackMutation, { data, loading, error }] = useAddTrackMutation({
 *   variables: {
 *      trackData: // value for 'trackData'
 *   },
 * });
 */
export function useAddTrackMutation(baseOptions?: Apollo.MutationHookOptions<AddTrackMutation, AddTrackMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddTrackMutation, AddTrackMutationVariables>(AddTrackDocument, options);
      }
export type AddTrackMutationHookResult = ReturnType<typeof useAddTrackMutation>;
export type AddTrackMutationResult = Apollo.MutationResult<AddTrackMutation>;
export type AddTrackMutationOptions = Apollo.BaseMutationOptions<AddTrackMutation, AddTrackMutationVariables>;
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

/**
 * __useGetTracksQuery__
 *
 * To run a query within a React component, call `useGetTracksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTracksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTracksQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetTracksQuery(baseOptions?: Apollo.QueryHookOptions<GetTracksQuery, GetTracksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTracksQuery, GetTracksQueryVariables>(GetTracksDocument, options);
      }
export function useGetTracksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTracksQuery, GetTracksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTracksQuery, GetTracksQueryVariables>(GetTracksDocument, options);
        }
export type GetTracksQueryHookResult = ReturnType<typeof useGetTracksQuery>;
export type GetTracksLazyQueryHookResult = ReturnType<typeof useGetTracksLazyQuery>;
export type GetTracksQueryResult = Apollo.QueryResult<GetTracksQuery, GetTracksQueryVariables>;
export const RemoveTrackDocument = gql`
    mutation RemoveTrack($id: Int!) {
  removeTrack(id: $id)
}
    `;
export type RemoveTrackMutationFn = Apollo.MutationFunction<RemoveTrackMutation, RemoveTrackMutationVariables>;

/**
 * __useRemoveTrackMutation__
 *
 * To run a mutation, you first call `useRemoveTrackMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveTrackMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeTrackMutation, { data, loading, error }] = useRemoveTrackMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveTrackMutation(baseOptions?: Apollo.MutationHookOptions<RemoveTrackMutation, RemoveTrackMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveTrackMutation, RemoveTrackMutationVariables>(RemoveTrackDocument, options);
      }
export type RemoveTrackMutationHookResult = ReturnType<typeof useRemoveTrackMutation>;
export type RemoveTrackMutationResult = Apollo.MutationResult<RemoveTrackMutation>;
export type RemoveTrackMutationOptions = Apollo.BaseMutationOptions<RemoveTrackMutation, RemoveTrackMutationVariables>;
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
export type SearchTrackMutationFn = Apollo.MutationFunction<SearchTrackMutation, SearchTrackMutationVariables>;

/**
 * __useSearchTrackMutation__
 *
 * To run a mutation, you first call `useSearchTrackMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSearchTrackMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [searchTrackMutation, { data, loading, error }] = useSearchTrackMutation({
 *   variables: {
 *      fingerprint: // value for 'fingerprint'
 *      args: // value for 'args'
 *   },
 * });
 */
export function useSearchTrackMutation(baseOptions?: Apollo.MutationHookOptions<SearchTrackMutation, SearchTrackMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SearchTrackMutation, SearchTrackMutationVariables>(SearchTrackDocument, options);
      }
export type SearchTrackMutationHookResult = ReturnType<typeof useSearchTrackMutation>;
export type SearchTrackMutationResult = Apollo.MutationResult<SearchTrackMutation>;
export type SearchTrackMutationOptions = Apollo.BaseMutationOptions<SearchTrackMutation, SearchTrackMutationVariables>;
export const CheckUsernameAvailabilityDocument = gql`
    query CheckUsernameAvailability($username: String!) {
  checkUsernameAvailability(username: $username)
}
    `;

/**
 * __useCheckUsernameAvailabilityQuery__
 *
 * To run a query within a React component, call `useCheckUsernameAvailabilityQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckUsernameAvailabilityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckUsernameAvailabilityQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useCheckUsernameAvailabilityQuery(baseOptions: Apollo.QueryHookOptions<CheckUsernameAvailabilityQuery, CheckUsernameAvailabilityQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CheckUsernameAvailabilityQuery, CheckUsernameAvailabilityQueryVariables>(CheckUsernameAvailabilityDocument, options);
      }
export function useCheckUsernameAvailabilityLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CheckUsernameAvailabilityQuery, CheckUsernameAvailabilityQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CheckUsernameAvailabilityQuery, CheckUsernameAvailabilityQueryVariables>(CheckUsernameAvailabilityDocument, options);
        }
export type CheckUsernameAvailabilityQueryHookResult = ReturnType<typeof useCheckUsernameAvailabilityQuery>;
export type CheckUsernameAvailabilityLazyQueryHookResult = ReturnType<typeof useCheckUsernameAvailabilityLazyQuery>;
export type CheckUsernameAvailabilityQueryResult = Apollo.QueryResult<CheckUsernameAvailabilityQuery, CheckUsernameAvailabilityQueryVariables>;
export const SigninDocument = gql`
    mutation signin($username: String!, $password: String!) {
  login(userData: {username: $username, password: $password}) {
    access_token
  }
}
    `;
export type SigninMutationFn = Apollo.MutationFunction<SigninMutation, SigninMutationVariables>;

/**
 * __useSigninMutation__
 *
 * To run a mutation, you first call `useSigninMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSigninMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signinMutation, { data, loading, error }] = useSigninMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSigninMutation(baseOptions?: Apollo.MutationHookOptions<SigninMutation, SigninMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SigninMutation, SigninMutationVariables>(SigninDocument, options);
      }
export type SigninMutationHookResult = ReturnType<typeof useSigninMutation>;
export type SigninMutationResult = Apollo.MutationResult<SigninMutation>;
export type SigninMutationOptions = Apollo.BaseMutationOptions<SigninMutation, SigninMutationVariables>;
export const SignoutDocument = gql`
    mutation signout {
  logout
}
    `;
export type SignoutMutationFn = Apollo.MutationFunction<SignoutMutation, SignoutMutationVariables>;

/**
 * __useSignoutMutation__
 *
 * To run a mutation, you first call `useSignoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signoutMutation, { data, loading, error }] = useSignoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useSignoutMutation(baseOptions?: Apollo.MutationHookOptions<SignoutMutation, SignoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignoutMutation, SignoutMutationVariables>(SignoutDocument, options);
      }
export type SignoutMutationHookResult = ReturnType<typeof useSignoutMutation>;
export type SignoutMutationResult = Apollo.MutationResult<SignoutMutation>;
export type SignoutMutationOptions = Apollo.BaseMutationOptions<SignoutMutation, SignoutMutationVariables>;
export const SignupDocument = gql`
    mutation signup($username: String!, $password: String!) {
  signup(userData: {username: $username, password: $password}) {
    access_token
  }
}
    `;
export type SignupMutationFn = Apollo.MutationFunction<SignupMutation, SignupMutationVariables>;

/**
 * __useSignupMutation__
 *
 * To run a mutation, you first call `useSignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signupMutation, { data, loading, error }] = useSignupMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSignupMutation(baseOptions?: Apollo.MutationHookOptions<SignupMutation, SignupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignupMutation, SignupMutationVariables>(SignupDocument, options);
      }
export type SignupMutationHookResult = ReturnType<typeof useSignupMutation>;
export type SignupMutationResult = Apollo.MutationResult<SignupMutation>;
export type SignupMutationOptions = Apollo.BaseMutationOptions<SignupMutation, SignupMutationVariables>;