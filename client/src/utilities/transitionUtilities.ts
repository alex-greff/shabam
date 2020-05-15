import { matchPath } from "react-router-dom";

// Note 1: keep up to date with @/styling/transitions/index.scss
// Note 2: some of these types and functions should probably be moved out to somewhere else
export type Transition = "page-slide" | "fade" | "top-slide" | "none";
export type Duration = "short" | "medium" | "long";

export type View = 
    "home" 
    | "search" 
    | "catalog" 
    | "account" 
    | "account-catalog"
    | "account-search-history"
    | "signin"
    | "signup"
    | "page-not-found"
const GLOBAL_PREFIX = "transition";

interface PageTransitionData {
    outTransition: Transition;
    inTransition: Transition;
    duration: Duration;
}

type PageTransitionMap = {
    [transitionName: string]: PageTransitionData;
}

type PathNameToViewMap = {
    [view: string]: View;
}

const PAGE_TRANSITIONS: PageTransitionMap = {
    // TODO: make real transitions here
    "home-to-search": {
        outTransition: "fade",
        inTransition: "top-slide",
        duration: "short"
    }
};

const DEFAULT_TRANSITION: PageTransitionData = {
    outTransition: "fade",
    inTransition: "fade",
    duration: "medium"
};

const VIEW_TO_PATHNAME: PathNameToViewMap = {
    "/": "home",
    "/search": "search",
    "/catalog": "catalog",
    "/account/:id": "account",
    "/account/:id/catalog": "account-catalog",
    "/account/:id/search-history": "account-search-history",
    "/signin": "signin",
    "/signup": "signup"
};

export const getTransitionId = (inTransition: Transition, outTransition: Transition, duration: Duration) => {
    return `${GLOBAL_PREFIX}-${duration}-in-${inTransition}-out-${outTransition}`;
};

export const getDuration = (duration: Duration) => {
    if (duration === "short") {
        return 0.2;
    } else if (duration === "medium") {
        return 0.5;
    } else if (duration === "long") {
        return 1;
    }

    throw new Error(`Unexpected duration type of '${duration}'`);
}

export const matchPathnameToView = (pathName?: string): View => {
    pathName = (pathName) ? pathName : "";
    const entries = Object.entries(VIEW_TO_PATHNAME);

    for (let i=0; i < entries.length; i++) {
        const [currPathName, view] = entries[i];

        const currMatch = matchPath(pathName, currPathName);

        if (currMatch && currMatch.isExact) {
            return view;
        }
    }

    return "page-not-found";
};

export const getViewTransitionId = (fromView: View, toView: View) => {
    const transitionName = `${fromView}-to-${toView}`;
    const transitionData = PAGE_TRANSITIONS[transitionName] ? PAGE_TRANSITIONS[transitionName] : DEFAULT_TRANSITION;

    return getTransitionId(transitionData.inTransition, transitionData.outTransition, transitionData.duration);
};

export const getViewTransitionDuration = (fromView: View, toView: View) => {
    const transitionName = `${fromView}-to-${toView}`;
    const transitionData = PAGE_TRANSITIONS[transitionName] ? PAGE_TRANSITIONS[transitionName] : DEFAULT_TRANSITION;

    return getDuration(transitionData.duration);
};