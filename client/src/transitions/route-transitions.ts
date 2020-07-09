import { ITransitionOptions } from "react-route-transition/dist/types";

// TODO: actually implement these
export const options: ITransitionOptions = {
    handlers: [
        {
            path: "/",
            onEnter: async () => {
                console.log("Hi /");
            },
            onLeave: async () => {
                console.log("Bye /");
            }
        },
        {
            path: "/search",
            onEnter: async () => {
                console.log("Hi /search");
            },
            onLeave: async () => {
                console.log("Bye /search");
            }
        },
        { 
            path: "/catalog",
            onEnter: async () => {
                console.log("Hi /catalog");
            },
            onLeave: async () => {
                console.log("Bye /catalog");
            }
        },
        {
            path: "/benchmark",
            onEnter: async () => {
                console.log("Hi /benchmark");
            },
            onLeave: async () => {
                console.log("Bye /benchmark");
            }
        },
        {
            path: "/signin",
            onEnter: async () => {
                console.log("Hi /signin");
            },
            onLeave: async () => {
                console.log("Bye /signin");
            }
        },
        {
            path: "/signup",
            onEnter: async () => {
                console.log("Hi /signup");
            },
            onLeave: async () => {
                console.log("Bye /signup");
            }
        },
        { 
            path: "/account/:id",
            onEnter: async () => {
                console.log("Hi /account/:id");
            },
            onLeave: async () => {
                console.log("Bye /account/:id");
            }
        },
        { 
            path: "/account/:id/search-history",
            onEnter: async () => {
                console.log("Hi /account/:id/search-history");
            },
            onLeave: async () => {
                console.log("Bye /account/:id/search-history");
            }
        },
        { 
            path: "/account/:id/catalog",
            onEnter: async () => {
                console.log("Hi /account/:id/catalog");
            },
            onLeave: async () => {
                console.log("Bye /account/:id/catalog");
            }
        },
    ]
};