export interface UserCredentials {
  username: string;
  password: string;
}

export interface LoginArgs {
  credentials: UserCredentials;
}

export interface CheckUsernameAvailabilityArgs {
  username: string;
}

export interface SignupArgs {
  credentials: UserCredentials;
}

export interface EditUserArgs {
  username: string;
  updatedCredentials: UserCredentials;
}

export interface EditUserRoleArgs {
  username: string;
  updatedRole: string;
}

export interface RemoveUserArgs {
  username: string;
}
