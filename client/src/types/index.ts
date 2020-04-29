import { RouteComponentProps, LinkProps } from "react-router-dom";
import { StaticContext } from "react-router";

export interface BaseProps {
    className?: string;
}

export interface AppLocationState {
    transition?: string;
    duration?: number;
}

export type AppRouteComponentProps = RouteComponentProps<{}, StaticContext, AppLocationState>;
export type AppLinkProps = LinkProps<AppLocationState>;