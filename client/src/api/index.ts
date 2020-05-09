import { accountStore } from "@/store/account/account.store";
import { apolloClient } from "@/App";

import {
    query as CheckUsernameQuery,
    Data as CheckUsernameData,
    Variables as CheckUsernameVariables
} from "@/graphql/user/CheckUsername";

import { 
    mutation as SigninMutation,
    Data as SigninData,
    Variables as SigninVariables 
} from "@/graphql/user/Signin";

import { 
    mutation as SignupMutation,
    Data as SignupData,
    Variables as SignupVariables 
} from "@/graphql/user/Signup";

import {
    mutation as SignoutMutation,
    Data as SignoutData
} from "@/graphql/user/Signout";


export const checkUsername = async (username: string) => {
    const result = await apolloClient.query<CheckUsernameData, CheckUsernameVariables>({
        query: CheckUsernameQuery,
        variables: {
            username
        }
    });

    return result.data.checkUsernameAvailability;
};


export const signin = async (username: string, password: string) => {
    const result = await apolloClient.mutate<SigninData, SigninVariables>({
        mutation: SigninMutation,
        variables: {
            username,
            password
        }
    });

    const signedIn = result.data!.login;

    if (signedIn) {
        // Update the mobx store
        accountStore.setLoggedIn(username);
    }

    return signedIn;
};

export const signup = async (username: string, password: string) => {
    const result = await apolloClient.mutate<SignupData, SignupVariables>({
        mutation: SignupMutation,
        variables: {
            username,
            password
        }
    });

    return result.data!.signup;
};

export const signout = async () => {
    const result = await apolloClient.mutate<SignoutData>({
        mutation: SignoutMutation
    });

    const signedOut = result.data!.logout;

    if (accountStore.loggedIn) {
        // Update the mobx store
        accountStore.setLoggedOut();
    }

    return signedOut;
}