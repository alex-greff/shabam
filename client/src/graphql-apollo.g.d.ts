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
  id: Scalars['ID'];
};


export type MutationRemoveTrackArgs = {
  id: Scalars['ID'];
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
export const SearchDocument = gql`
    mutation search($fingerprint: FingerprintInput!) {
  search(fingerprint: $fingerprint) {
    something
  }
}
    `;
export type SearchMutationFn = Apollo.MutationFunction<SearchMutation, SearchMutationVariables>;

/**
 * __useSearchMutation__
 *
 * To run a mutation, you first call `useSearchMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSearchMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [searchMutation, { data, loading, error }] = useSearchMutation({
 *   variables: {
 *      fingerprint: // value for 'fingerprint'
 *   },
 * });
 */
export function useSearchMutation(baseOptions?: Apollo.MutationHookOptions<SearchMutation, SearchMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SearchMutation, SearchMutationVariables>(SearchDocument, options);
      }
export type SearchMutationHookResult = ReturnType<typeof useSearchMutation>;
export type SearchMutationResult = Apollo.MutationResult<SearchMutation>;
export type SearchMutationOptions = Apollo.BaseMutationOptions<SearchMutation, SearchMutationVariables>;
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