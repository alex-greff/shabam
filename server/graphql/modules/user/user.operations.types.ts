export interface UserCredentials {
    email: string;
    password: string;
}

export interface LoginArgs {
    credentials: UserCredentials;
}

export interface SignupArgs {
    credentials: UserCredentials;
}

export interface EditUserArgs {
    email: string;
    updatedCredentials: UserCredentials;
}

export interface EditUserRoleArgs {
    email: string;
    updatedRole: string;
}

export interface RemoveUserArgs {
    email: string;
}