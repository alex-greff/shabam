import { ITransitionOptions } from "react-route-transition/dist/types";
import gsap from "gsap";

// TODO: actually implement these
export const options: ITransitionOptions = {
  handlers: [
    {
      path: "/",
      onEnter: async () => {
        // console.log("Hi /"); // TODO: remove

        // TODO: make better animations
        gsap.killTweensOf("#Home .Home__content");
        await gsap.fromTo(
          "#Home .Home__content",
          { opacity: 0 },
          { opacity: 1, duration: 0.5 }
        );
      },
      onLeave: async () => {
        // console.log("Bye /"); // TODO: remove

        // TODO: make better animations
        gsap.killTweensOf("#Home .Home__content");
        await gsap.to("#Home .Home__content", { opacity: 0, duration: 0.3 });
      },
    },
    {
      path: "/search",
      onEnter: async () => {
        // console.log("Hi /search"); // TODO: remove
        // No animation needed
      },
      onLeave: async () => {
        // console.log("Bye /search"); // TODO: remove
        // No animation needed
      },
    },
    {
      path: "/catalog",
      onEnter: async () => {
        // console.log("Hi /catalog"); // TODO: remove
      },
      onLeave: async () => {
        // console.log("Bye /catalog"); // TODO: remove
      },
    },
    {
      path: "/benchmark",
      onEnter: async () => {
        // console.log("Hi /benchmark"); // TODO: remove
      },
      onLeave: async () => {
        // console.log("Bye /benchmark"); // TODO: remove
      },
    },
    {
      path: "/signin",
      onEnter: async () => {
        // console.log("Hi /signin"); // TODO: remove
      },
      onLeave: async () => {
        // console.log("Bye /signin"); // TODO: remove
      },
    },
    {
      path: "/signup",
      onEnter: async () => {
        // console.log("Hi /signup"); // TODO: remove
      },
      onLeave: async () => {
        // console.log("Bye /signup"); // TODO: remove
      },
    },
    {
      path: "/account/:id",
      onEnter: async () => {
        // console.log("Hi /account/:id"); // TODO: remove
      },
      onLeave: async () => {
        // console.log("Bye /account/:id"); // TODO: remove
      },
    },
    {
      path: "/account/:id/search-history",
      onEnter: async () => {
        // console.log("Hi /account/:id/search-history"); // TODO: remove
      },
      onLeave: async () => {
        // console.log("Bye /account/:id/search-history"); // TODO: remove
      },
    },
    {
      path: "/account/:id/catalog",
      onEnter: async () => {
        // console.log("Hi /account/:id/catalog"); // TODO: remove
      },
      onLeave: async () => {
        // console.log("Bye /account/:id/catalog"); // TODO: remove
      },
    },
  ],
};
