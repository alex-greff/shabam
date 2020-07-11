import { AuthenticationError, UserInputError } from "apollo-server-express";

/**
 * Throws the standard authorization error.
 */
export const throwAuthenticationError = () => {
  throw new AuthenticationError("Authentication failed");
};

/**
 * Throws a general server error.
 */
export const throwServerError = () => {
  throw new Error(`An error occurred on the server`);
};

/**
 * Throws a user input error.
 *
 * @param message The error message.
 */
export const throwUserInputError = (message: string) => {
  throw new UserInputError(message);
};

/**
 * For when a username does not exist.
 *
 * @param username The username.
 */
export const throwUsernameNotExistsError = (username: string) => {
  return throwUserInputError(`The username '${username}' does not exist`);
};

/**
 * For when a username already exists.
 *
 * @param username The username.
 */
export const throwUsernameAlreadyExistsError = (username: string) => {
  return throwUserInputError(`User '${username}' already exists`);
};

/**
 * For when a username is invalid.
 *
 * @param username The username.
 */
export const throwUsernameInvalidError = (username: string) => {
  return throwUserInputError(`Username '${username}' is invalid`);
};

/**
 * For when a username being changed is the same as the old one.
 */
export const throwUsernameTheSameError = () => {
  return throwUserInputError(
    "New username must be different than the current one"
  );
};

/**
 * For when a password being changed is the same as the old one.
 */
export const throwPasswordTheSameError = () => {
  return throwUserInputError("New password must be different");
};

/**
 * For when a role does not exist.
 *
 * @param role The role.
 */
export const throwRoleNotExistsError = (role: string) => {
  return throwUserInputError(`Role '${role}' does not exist`);
};
