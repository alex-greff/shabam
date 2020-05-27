import { RouteComponentProps, LinkProps } from "react-router-dom";
import { StaticContext } from "react-router";
import { Duration } from "@/utilities/transitionUtilities";

export interface BaseProps {
    className?: string;
    style?: React.CSSProperties;
    id?: string;
}

export interface AppLocationState {
    transitionId?: string;
    transitionDuration?: Duration;
    prevPathname: string;
}

export type AppRouteComponentProps = RouteComponentProps<{}, StaticContext, AppLocationState>;
export type AppLinkProps = LinkProps<AppLocationState>;