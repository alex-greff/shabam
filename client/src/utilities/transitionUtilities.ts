// Note: keep up to date with @/styling/transitions/index.scss
export type Transition = "page-slide" | "fade" | "top-slide" | "none";
export type Duration = "short" | "medium" | "long";
const GLOBAL_PREFIX = "transition";

export const getTransitionId = (inTransition: Transition, outTransition: Transition, durationType: Duration) => {
    return `${GLOBAL_PREFIX}-${durationType}-in-${inTransition}-out-${outTransition}`;
};

export const getDuration = (durationType: Duration) => {
    if (durationType === "short") {
        return 0.2;
    } else if (durationType === "medium") {
        return 0.5;
    } else if (durationType === "long") {
        return 1;
    }

    throw new Error(`Unexpected duration type of '${durationType}'`);
}