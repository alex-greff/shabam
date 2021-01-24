import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
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
  /** File upload scalar type */
  Upload: any;
};

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
  artists: Array<Scalars['String']>;
  coverImage?: Maybe<Scalars['String']>;
  releaseDate?: Maybe<Scalars['Date']>;
  createdDate: Scalars['Date'];
  updatedDate: Scalars['Date'];
};


/** A track object. */
export type Track = {
  __typename?: 'Track';
  id: Scalars['ID'];
  addressDatabase: Scalars['Int'];
  metadata: TrackMetadata;
};

/** A possible search result. */
export type TrackSearchResult = {
  __typename?: 'TrackSearchResult';
  track: Track;
  similarity: Scalars['Float'];
};

export type Recipe = {
  __typename?: 'Recipe';
  id: Scalars['ID'];
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  creationDate: Scalars['Date'];
  ingredients: Array<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  /** Checks if the given username is available.  */
  checkUsernameAvailability: Scalars['Boolean'];
  /** Get a specific track in the catalog. */
  getTrack: Track;
  /** Get a paginated list of all tracks in the catalog. */
  getTracks: Array<Track>;
  /** Searches for a track based off the given audio fingerprint. */
  searchTrack: Array<TrackSearchResult>;
  recipe: Recipe;
  recipes: Array<Recipe>;
};


export type QueryCheckUsernameAvailabilityArgs = {
  username: Scalars['String'];
};


export type QueryGetTrackArgs = {
  id: Scalars['ID'];
};


export type QueryGetTracksArgs = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
};


export type QuerySearchTrackArgs = {
  fingerprintInfo: FingerprintInfoInput;
  fingerprint: Scalars['Upload'];
};


export type QueryRecipeArgs = {
  id: Scalars['String'];
};


export type QueryRecipesArgs = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
};

/** Supporting information for the raw fingerprint data. */
export type FingerprintInfoInput = {
  windowAmount: Scalars['Int'];
  partitionAmount: Scalars['Int'];
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
  addRecipe: Recipe;
  removeRecipe: Scalars['Boolean'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
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
  fingerprintInfo: FingerprintInfoInput;
  fingerprint: Scalars['Upload'];
  id: Scalars['ID'];
};


export type MutationAddRecipeArgs = {
  newRecipeData: NewRecipeInput;
};


export type MutationRemoveRecipeArgs = {
  id: Scalars['String'];
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
  artists: Array<Scalars['String']>;
  coverImage?: Maybe<Scalars['String']>;
  releaseDate?: Maybe<Scalars['Date']>;
};

/** Input data for editing a track. */
export type TrackEditDataInput = {
  title?: Maybe<Scalars['String']>;
  artists?: Maybe<Array<Scalars['String']>>;
  coverImage?: Maybe<Scalars['String']>;
  releaseDate?: Maybe<Scalars['Date']>;
};

export type NewRecipeInput = {
  title: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  ingredients: Array<Scalars['String']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  /** Notifies whenever a track is added.  */
  trackAdded: Track;
  /** Notifies whenever a track is added. Can filter by track id. */
  trackEdited: Track;
  /** Notifies whenever a track is deleted. Can filter by track id. */
  trackRemoved: Scalars['String'];
  recipeAdded: Recipe;
};

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


export const SigninDocument = gql`
    mutation signin($username: String!, $password: String!) {
  login(username: $username, password: $password) {
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
        return Apollo.useMutation<SigninMutation, SigninMutationVariables>(SigninDocument, baseOptions);
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
        return Apollo.useMutation<SignoutMutation, SignoutMutationVariables>(SignoutDocument, baseOptions);
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
        return Apollo.useMutation<SignupMutation, SignupMutationVariables>(SignupDocument, baseOptions);
      }
export type SignupMutationHookResult = ReturnType<typeof useSignupMutation>;
export type SignupMutationResult = Apollo.MutationResult<SignupMutation>;
export type SignupMutationOptions = Apollo.BaseMutationOptions<SignupMutation, SignupMutationVariables>;